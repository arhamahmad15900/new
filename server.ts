import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { liveTestStore } from "./server/liveTestManager.js";

let aiClient: GoogleGenAI | null = null;
let quotaExhaustedUntil = 0;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

/**
 * 503 UNAVAILABLE / High Demand error retry handler
 * Aggar API high demand ki wajah se 503 error degi, toh yeh function
 * automatically exponential backoff delay (2s -> 4s -> 8s) ke saath retry karega.
 */
async function callGeminiWithRetry<T>(
  apiCallFn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCallFn();
    } catch (error: any) {
      const is503 = 
        error?.status === 503 || 
        error?.code === 503 ||
        error?.message?.includes("503") || 
        error?.message?.includes("high demand") ||
        error?.message?.includes("UNAVAILABLE");

      if (is503 && i < retries - 1) {
        console.warn(`[Gemini API 503] Model busy. Retrying in ${delayMs / 1000}s... (Attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries reached.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ limit: "30mb", extended: true }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Multimodal Gemini AI Endpoint: Read PDF notes and generate questions SOLELY from the uploaded PDF
  app.post("/api/generate-pdf-reasoning-questions", async (req, res) => {
    const { pdfBase64, count = 50, timestamp = Date.now(), seed = Math.random().toString() } = req.body;
    const requestedTotal = Math.min(Math.max(Number(count) || 10, 5), 100);

    // Require valid uploaded PDF
    if (!pdfBase64 || typeof pdfBase64 !== "string" || pdfBase64.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: "Please upload your PDF study notes. Questions on this website must be generated solely from user-uploaded PDF notes and not from any other source."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server. AI question synthesis requires Gemini API access."
      });
    }

    try {
      const ai = getAIClient();

      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "").trim();
      const basePdfParts = [{
        inlineData: {
          mimeType: "application/pdf",
          data: cleanBase64
        }
      }];

      // Fast, manageable batch size of 15 Qs per batch
      const batchSize = requestedTotal <= 15 ? requestedTotal : 15;
      const totalBatches = Math.ceil(requestedTotal / batchSize);
      const batchCounts: number[] = [];
      let rem = requestedTotal;
      for (let i = 0; i < totalBatches; i++) {
        const c = Math.min(rem, batchSize);
        batchCounts.push(c);
        rem -= c;
      }

      const generateBatch = async (bCount: number, batchIdx: number): Promise<any[]> => {
        const randomEntropyKey = `SESSION_${timestamp}_VARIATION_${seed}_BATCH_${batchIdx + 1}_RND_${Math.floor(Math.random() * 1000000)}`;

        const instructions = `You are an expert examination question paper setter.
CRITICAL GROUNDING MANDATE:
Synthesize exactly ${bCount} Multiple Choice Questions (MCQs) (Batch ${batchIdx + 1} of ${totalBatches}) SOLELY AND EXCLUSIVELY from the factual text, definitions, formulas, arguments, principles, and concepts present in the user-uploaded PDF notes.

STRICT RESTRICTIONS:
1. ABSOLUTELY NO OUTSIDE KNOWLEDGE OR OTHER SOURCES:
   - DO NOT pull questions, facts, topics, or premises from any other source, external syllabus, pre-trained internet knowledge, or third-party question banks.
   - Every question text, all four options [A, B, C, D], the correct answer, and the step-by-step explanation MUST be directly grounded in and verifiable within the provided PDF notes.
   - If a concept, term, or problem is NOT explicitly mentioned or explained in the attached PDF notes, you MUST NOT ask questions about it.

2. BILINGUAL PRESENTATION:
   - questionEn: Authentic question text in English derived solely from the uploaded notes.
   - questionHi: Professional Hindi translation of the question.
   - optionsEn: Array of EXACTLY 4 distinct English options [A, B, C, D] where the correct answer and distractors are grounded in the notes.
   - optionsHi: Array of EXACTLY 4 corresponding Hindi options [A, B, C, D].

3. 4 OPTIONS & STRICTLY VALIDATED KEY:
   - Exactly 4 options.
   - correctIndex: Integer 0, 1, 2, or 3 pointing strictly to the single correct option supported by the notes.

4. STEP-BY-STEP EXPLANATION:
   - explanationEn: Step-by-step walkthrough in English citing the exact fact, formula, or logic from the notes.
   - explanationHi: Detailed explanation in Hindi.

5. TOPIC & DIFFICULTY:
   - topic: Specific topic/section heading name taken directly from the PDF notes.
   - difficulty: "O Level Difficulty"

Generation Entropy Token: ${randomEntropyKey}
Return ONLY a JSON array adhering strictly to the schema.`;

        const contentsParts = [...basePdfParts, { text: instructions }];
        const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
        let resp: any = null;
        let lastError: any = null;

        for (const modelName of modelsToTry) {
          try {
            // High demand 503 error handling retry wrapper
            resp = await callGeminiWithRetry(() =>
              ai.models.generateContent({
                model: modelName,
                contents: {
                  parts: contentsParts
                },
                config: {
                  temperature: 0.7,
                  responseMimeType: "application/json",
                  responseSchema: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        questionEn: { type: Type.STRING },
                        questionHi: { type: Type.STRING },
                        optionsEn: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        optionsHi: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        correctIndex: { type: Type.INTEGER },
                        explanationEn: { type: Type.STRING },
                        explanationHi: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        difficulty: { type: Type.STRING }
                      },
                      required: ["questionEn", "optionsEn", "correctIndex", "explanationEn", "optionsHi", "questionHi"]
                    }
                  }
                }
              })
            );
            if (resp && resp.text) break;
          } catch (err: any) {
            lastError = err;
          }
        }

        if (!resp || !resp.text) {
          throw new Error(lastError?.message || "Failed to generate questions from the uploaded PDF notes.");
        }

        const parsed = JSON.parse(resp.text || "[]");
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("No valid questions could be extracted from the uploaded PDF notes.");
        }
        return parsed;
      };

      // Run batches with concurrency control (2 concurrent requests)
      const allResults: any[] = [];
      for (let i = 0; i < batchCounts.length; i += 2) {
        const slice = batchCounts.slice(i, i + 2);
        const batchPromises = slice.map((c, sIdx) => generateBatch(c, i + sIdx));
        const resolved = await Promise.all(batchPromises);
        resolved.forEach(arr => allResults.push(...arr));
      }

      if (allResults.length === 0) {
        return res.status(500).json({
          success: false,
          error: "Unable to generate questions from the uploaded PDF notes. Please make sure the PDF contains readable text."
        });
      }

      return res.json({ success: true, questions: allResults, solelyFromPdf: true });
    } catch (error: any) {
      console.error("Error generating questions solely from PDF:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to generate questions solely from the uploaded PDF notes. Questions from other sources are not allowed."
      });
    }
  });

  // AI-powered NIELIT O-Level question generation endpoint
  app.post("/api/generate-ai-questions", async (req, res) => {
    try {
      const { moduleCode, moduleTitle, chapterName, count = 5, topic } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured in environment.",
          fallbackAvailable: true
        });
      }

      const ai = getAIClient();
      const prompt = `You are a Senior Question Paper Setter for NIELIT (National Institute of Electronics and Information Technology) for the 'O Level' examination (Revision 5.1).
Generate ${count} authentic, exam-quality Multiple Choice Questions (MCQs) for:
Module: ${moduleCode} - ${moduleTitle}
Chapter/Topic: ${chapterName} ${topic ? `(Focus: ${topic})` : ''}

Strict Requirements:
1. Each question must have:
   - questionEn: English question text
   - questionHi: Hindi translation of the question
   - optionsEn: Array of 4 English options [A, B, C, D]
   - optionsHi: Array of 4 Hindi options [A, B, C, D]
   - correctIndex: 0, 1, 2, or 3 representing the index of the correct option
   - explanationEn: Detailed explanation in English citing standard facts
   - explanationHi: Detailed explanation in Hindi
   - difficulty: "easy", "medium", or "hard"
2. Questions must be strictly based on the official NIELIT O Level R5.1 curriculum (like Examjila and official NIELIT previous year papers).
3. Do NOT make trick questions with ambiguous answers. Return only valid JSON adhering to the schema.`;

      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionEn: { type: Type.STRING },
                  questionHi: { type: Type.STRING },
                  optionsEn: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  optionsHi: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanationEn: { type: Type.STRING },
                  explanationHi: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
                },
                required: ["questionEn", "optionsEn", "correctIndex", "explanationEn"]
              }
            }
          }
        })
      );

      const parsed = JSON.parse(response.text || "[]");
      return res.json({ success: true, questions: parsed });
    } catch (error: any) {
      console.error("Error generating AI questions:", error);
      return res.status(500).json({ error: error.message || "Failed to generate questions" });
    }
  });

  // ==========================================
  // HOST & JOIN LIVE TEST SESSION ENDPOINTS
  // ==========================================

  // 1. Host creates a live test server
  app.post("/api/live-tests/create", (req, res) => {
    try {
      const {
        hostName,
        title,
        subOptionTitle,
        mode,
        durationMinutes,
        questionCount,
        config,
        questions,
        passcode,
        allowLateJoiners,
        showImmediateResults,
        negativeMarking
      } = req.body;

      let validQuestions = questions;
      if (!validQuestions || !Array.isArray(validQuestions) || validQuestions.length === 0) {
        if (mode === "pdf_notes") {
          return res.status(400).json({
            success: false,
            error: "Questions must be synthesized from uploaded PDF notes. No questions from external sources are allowed."
          });
        }
        return res.status(400).json({
          success: false,
          error: "Questions are required to create a live test session."
        });
      }

      const { session, hostToken } = liveTestStore.createSession({
        hostName: hostName || "Examiner",
        title: title || "NIELIT O Level Live Examination",
        subOptionTitle,
        mode: mode === "pdf_notes" ? "pdf_notes" : "exam_generator",
        durationMinutes: Number(durationMinutes) || 90,
        questionCount: validQuestions.length,
        config: config || {},
        passcode,
        allowLateJoiners,
        showImmediateResults,
        negativeMarking,
        questions: validQuestions
      });

      return res.json({
        success: true,
        testId: session.testId,
        hostToken,
        session: {
          testId: session.testId,
          title: session.title,
          subOptionTitle: session.subOptionTitle,
          mode: session.mode,
          status: session.status,
          durationMinutes: session.durationMinutes,
          questionCount: session.questionCount,
          hostName: session.hostName,
          createdAt: session.createdAt,
          passcode: session.passcode,
          allowLateJoiners: session.allowLateJoiners,
          showImmediateResults: session.showImmediateResults,
          negativeMarking: session.negativeMarking,
          students: session.students
        }
      });
    } catch (err: any) {
      console.error("Failed to create live test session:", err);
      return res.status(500).json({ error: err.message || "Could not create live test server." });
    }
  });

  // 2. Student joins a live test session
  app.post("/api/live-tests/:testId/join", (req, res) => {
    try {
      const { testId } = req.params;
      const { studentName, rollNumber, passcode } = req.body;

      if (!studentName || !studentName.trim()) {
        return res.status(400).json({ error: "Please enter your full name." });
      }
      if (!rollNumber || !rollNumber.trim()) {
        return res.status(400).json({ error: "Please enter your roll number." });
      }

      const result = liveTestStore.joinStudent(testId, studentName, rollNumber, passcode);
      if ("error" in result) {
        return res.status(404).json({ error: result.error });
      }

      return res.json({
        success: true,
        student: result.student,
        session: {
          testId: result.session.testId,
          title: result.session.title,
          subOptionTitle: result.session.subOptionTitle,
          mode: result.session.mode,
          status: result.session.status,
          startedAt: result.session.startedAt,
          durationMinutes: result.session.durationMinutes,
          questionCount: result.session.questionCount,
          hostName: result.session.hostName,
          broadcastMessage: result.session.broadcastMessage,
          broadcastTime: result.session.broadcastTime,
          showImmediateResults: result.session.showImmediateResults,
          negativeMarking: result.session.negativeMarking,
          // Only send questions if test has started
          questions: result.session.status === "in_progress" ? result.session.questions : []
        }
      });
    } catch (err: any) {
      console.error("Error joining live test:", err);
      return res.status(500).json({ error: err.message || "Could not join test session." });
    }
  });

  // 3. Poll session status & student roster
  app.get("/api/live-tests/:testId/session", (req, res) => {
    try {
      const { testId } = req.params;
      const { hostToken, studentId } = req.query;

      const session = liveTestStore.getSession(testId);
      if (!session) {
        return res.status(404).json({ error: "Session not found." });
      }

      const isHost = hostToken && session.hostToken === hostToken;

      if (isHost) {
        return res.json({
          success: true,
          isHost: true,
          session: {
            testId: session.testId,
            title: session.title,
            subOptionTitle: session.subOptionTitle,
            mode: session.mode,
            status: session.status,
            createdAt: session.createdAt,
            startedAt: session.startedAt,
            durationMinutes: session.durationMinutes,
            questionCount: session.questionCount,
            hostName: session.hostName,
            passcode: session.passcode,
            allowLateJoiners: session.allowLateJoiners,
            showImmediateResults: session.showImmediateResults,
            negativeMarking: session.negativeMarking,
            broadcastMessage: session.broadcastMessage,
            broadcastTime: session.broadcastTime,
            proctoringAlerts: session.proctoringAlerts || [],
            students: Object.values(session.students),
            questionsCount: session.questions.length,
            questions: session.questions
          }
        });
      }

      // Safe view for students
      const student = studentId ? session.students[String(studentId)] : null;
      const studentSummaryList = Object.values(session.students).map(s => ({
        id: s.id,
        studentName: s.studentName,
        rollNumber: s.rollNumber,
        status: s.status,
        joinedAt: s.joinedAt
      }));

      return res.json({
        success: true,
        isHost: false,
        session: {
          testId: session.testId,
          title: session.title,
          subOptionTitle: session.subOptionTitle,
          mode: session.mode,
          status: session.status,
          startedAt: session.startedAt,
          durationMinutes: session.durationMinutes,
          questionCount: session.questionCount,
          hostName: session.hostName,
          broadcastMessage: session.broadcastMessage,
          broadcastTime: session.broadcastTime,
          showImmediateResults: session.showImmediateResults,
          negativeMarking: session.negativeMarking,
          students: studentSummaryList,
          myStudentStatus: student ? student.status : null,
          // Only send actual questions once the test has been officially started by the host!
          questions: session.status === "in_progress" || session.status === "ended" ? session.questions : []
        }
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to fetch session." });
    }
  });

  // 4. Host starts the test (students automatically begin)
  app.post("/api/live-tests/:testId/start", (req, res) => {
    try {
      const { testId } = req.params;
      const { hostToken } = req.body;

      const result = liveTestStore.startTest(testId, hostToken);
      if (!result.success) {
        return res.status(403).json({ error: result.error || "Cannot start test." });
      }

      return res.json({
        success: true,
        status: "in_progress",
        startedAt: result.session?.startedAt
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to start test." });
    }
  });

  // 5. Student sends live answering progress
  app.post("/api/live-tests/:testId/progress", (req, res) => {
    try {
      const { testId } = req.params;
      const { studentId, answersCount, userAnswers, tabSwitchesCount } = req.body;

      const ok = liveTestStore.updateStudentProgress(
        testId,
        studentId,
        Number(answersCount) || 0,
        userAnswers,
        typeof tabSwitchesCount === "number" ? tabSwitchesCount : undefined
      );
      return res.json({ success: ok });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 6. Student submits their test
  app.post("/api/live-tests/:testId/submit", (req, res) => {
    try {
      const { testId } = req.params;
      const { studentId, score, maxScore, percentage, userAnswers } = req.body;

      const ok = liveTestStore.submitStudentTest(
        testId,
        studentId,
        Number(score) || 0,
        Number(maxScore) || 100,
        Number(percentage) || 0,
        userAnswers || {}
      );
      return res.json({ success: ok });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 6b. Student logs proctoring infraction / event (tab switch, window blur, browser close, auto-submit)
  app.post("/api/live-tests/:testId/proctor-event", (req, res) => {
    try {
      const { testId } = req.params;
      const {
        studentId,
        eventType,
        tabSwitchesCount,
        isAutoSubmitted,
        score,
        maxScore,
        percentage,
        userAnswers
      } = req.body;

      const result = liveTestStore.recordProctoringEvent(
        testId,
        studentId,
        eventType,
        {
          tabSwitchesCount: typeof tabSwitchesCount === 'number' ? tabSwitchesCount : undefined,
          isAutoSubmitted: Boolean(isAutoSubmitted),
          score: typeof score === 'number' ? score : undefined,
          maxScore: typeof maxScore === 'number' ? maxScore : undefined,
          percentage: typeof percentage === 'number' ? percentage : undefined,
          userAnswers
        }
      );
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 7. Host ends test for everyone
  app.post("/api/live-tests/:testId/end", (req, res) => {
    try {
      const { testId } = req.params;
      const { hostToken } = req.body;

      const result = liveTestStore.endTest(testId, hostToken);
      if (!result.success) {
        return res.status(403).json({ error: result.error || "Cannot end test." });
      }
      return res.json({ success: true, status: "ended" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 8. Host kicks/removes a student
  app.post("/api/live-tests/:testId/kick", (req, res) => {
    try {
      const { testId } = req.params;
      const { hostToken, studentId } = req.body;

      const ok = liveTestStore.kickStudent(testId, hostToken, studentId);
      return res.json({ success: ok });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 9. Host broadcasts message to all students
  app.post("/api/live-tests/:testId/broadcast", (req, res) => {
    try {
      const { testId } = req.params;
      const { hostToken, message } = req.body;

      const ok = liveTestStore.setBroadcastMessage(testId, hostToken, String(message || ""));
      return res.json({ success: ok });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 10. Host updates session settings (e.g. toggle immediate candidate results, late joining)
  app.post("/api/live-tests/:testId/settings", (req, res) => {
    try {
      const { testId } = req.params;
      const { hostToken, showImmediateResults, allowLateJoiners } = req.body;

      const ok = liveTestStore.updateSessionSettings(testId, hostToken, {
        showImmediateResults: typeof showImmediateResults === "boolean" ? showImmediateResults : undefined,
        allowLateJoiners: typeof allowLateJoiners === "boolean" ? allowLateJoiners : undefined
      });
      return res.json({ success: ok });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 10. Host deletes/closes a session
  app.delete("/api/live-tests/:testId", (req, res) => {
    try {
      const { testId } = req.params;
      const { hostToken } = req.body;

      const ok = liveTestStore.deleteSession(testId, hostToken);
      return res.json({ success: ok });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();