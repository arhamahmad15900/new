import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Play, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Layers, 
  Languages, 
  Sliders, 
  BrainCircuit, 
  Check, 
  Copy,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { Question, GeneratedTest, TestConfiguration } from '../types';
import { soundFx } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { SAMPLE_REASONING_PDF_NAME, SAMPLE_REASONING_PDF_BASE64 } from '../data/sampleReasoningPdf';

interface PdfReasoningStudioProps {
  onLaunchTest: (test: GeneratedTest, mode: 'cbt' | 'paper') => void;
}

export const PdfReasoningStudio: React.FC<PdfReasoningStudioProps> = ({ onLaunchTest }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  
  // Configuration options: default 50 Qs or 100 Qs; default difficulty: 'O Level Difficulty'
  const [questionCount, setQuestionCount] = useState<number>(50);
  const defaultDifficulty = "O Level Difficulty";

  // Generation status
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [showHindi, setShowHindi] = useState<boolean>(false);

  // Handle file selection
  const processFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF document (.pdf).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit. Please upload a smaller PDF notes file.');
      return;
    }

    setError(null);
    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPdfBase64(result);
    };
    reader.onerror = () => {
      setError('Failed to read the PDF file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // 1-Click Load Sample PDF Notes
  const handleLoadSamplePdf = () => {
    setError(null);
    const mockFile = new File(
      [new Blob(['Sample NIELIT O-Level Notes'], { type: 'application/pdf' })],
      SAMPLE_REASONING_PDF_NAME,
      { type: 'application/pdf' }
    );
    setPdfFile(mockFile);
    setPdfBase64(SAMPLE_REASONING_PDF_BASE64);
    soundFx.playSuccess();
  };

  // Generate Questions via API
  const handleGenerateQuestions = async () => {
    // Validate if PDF has been provided
    if (!pdfBase64 || !pdfFile) {
      setError('Please upload your PDF notes first. Questions are generated solely from your uploaded PDF notes and not from any other source.');
      soundFx.playClick(280, 0.06);
      return;
    }

    const effectivePdfBase64 = pdfBase64;
    setError(null);
    setLoading(true);
    setLoadingStep(`Analyzing uploaded PDF notes & synthesizing ${questionCount} questions solely from PDF content...`);
    soundFx.playClick();

    try {
      const response = await fetch('/api/generate-pdf-reasoning-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pdfBase64: effectivePdfBase64,
          count: questionCount,
          timestamp: Date.now(),
          seed: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
        })
      });

      setLoadingStep('Synthesizing bilingual questions, 4-option keys & step-by-step logic deductions...');

      const responseText = await response.text();
      let data: any = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { error: responseText || 'Server returned an unreadable response.' };
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reasoning questions.');
      }

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions could be extracted. Please ensure the notes contain conceptual text.');
      }

      // Format questions into standard Question format
      const formatted: Question[] = data.questions.map((q: any, idx: number) => ({
        id: `LR-AI-${Date.now()}-${idx + 1}`,
        moduleId: 'M3',
        chapterNumber: idx + 1,
        chapterName: q.topic || 'PDF Study Notes',
        questionEn: q.questionEn,
        questionHi: q.questionHi || q.questionEn,
        optionsEn: [
          q.optionsEn[0] || 'Option A',
          q.optionsEn[1] || 'Option B',
          q.optionsEn[2] || 'Option C',
          q.optionsEn[3] || 'Option D'
        ],
        optionsHi: q.optionsHi && q.optionsHi.length === 4 ? [
          q.optionsHi[0],
          q.optionsHi[1],
          q.optionsHi[2],
          q.optionsHi[3]
        ] : undefined,
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        explanationEn: q.explanationEn || 'Step-by-step logical deduction established by the premises.',
        explanationHi: q.explanationHi,
        source: 'ai_generated',
        sourceLabel: 'Solely Generated from Uploaded PDF Notes',
        difficulty: defaultDifficulty,
        topic: q.topic || 'PDF Study Notes'
      }));

      setGeneratedQuestions(formatted);
      setUserAnswers({});
      setShowExplanations({});
      soundFx.playSuccess();
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message || 'An unexpected error occurred while generating questions.');
      soundFx.playClick(240, 0.12);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Build a standard GeneratedTest object from the AI questions
  const createGeneratedTestObject = (): GeneratedTest => {
    const config: TestConfiguration = {
      moduleId: 'M3',
      testType: 'standard',
      selectedChapters: [1, 2, 3, 4, 5],
      questionCount: generatedQuestions.length > 50 ? 100 : 50,
      durationMinutes: Math.max(15, Math.ceil(generatedQuestions.length * 1.5)) as any,
      bookletSeries: 'A',
      candidateName: 'Logical Reasoning Candidate',
      rollNumber: 'LR-' + Math.floor(100000 + Math.random() * 900000),
      sourceFilter: 'all',
      shuffleQuestions: false,
      shuffleOptions: false,
      includeAnswerKey: true,
      includeExplanations: true,
      includeOMRSheet: true,
    };

    return {
      id: `LR-TEST-${Date.now()}`,
      title: `Logical Reasoning Exam: ${pdfFile?.name ? pdfFile.name.replace(/\.[^/.]+$/, '') : 'PDF Notes Synthesis'}`,
      moduleCode: 'LR-AI',
      moduleTitle: 'Logical Reasoning & Analytical Aptitude',
      config: config,
      questions: generatedQuestions,
      createdAt: new Date().toISOString()
    };
  };

  const handleLaunchCbt = () => {
    if (generatedQuestions.length === 0) return;
    const test = createGeneratedTestObject();
    onLaunchTest(test, 'cbt');
    soundFx.playClick();
  };

  const handleLaunchPaper = () => {
    if (generatedQuestions.length === 0) return;
    const test = createGeneratedTestObject();
    onLaunchTest(test, 'paper');
    soundFx.playClick();
  };

  const copyToClipboard = () => {
    if (generatedQuestions.length === 0) return;
    const text = generatedQuestions.map((q, i) => {
      return `Q${i + 1}. [${q.topic || 'Reasoning'}] ${q.questionEn}
A) ${q.optionsEn[0]}
B) ${q.optionsEn[1]}
C) ${q.optionsEn[2]}
D) ${q.optionsEn[3]}
Correct Answer: Option ${['A', 'B', 'C', 'D'][q.correctIndex || 0]}
Step-by-Step Logic Explanation:
${q.explanationEn}
----------------------------------------`;
    }).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    soundFx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero / Information Header */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              PDF Notes to Logical Reasoning Questions
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload your handwritten or typed study PDF notes. The AI reads the entire document, 
              detects structural premises, and synthesizes exam-grade questions with bilingual text, 4 options, a validated key, and deductive step-by-step explanations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-200 block">3 Key Question Features:</span>
              <ul className="text-slate-400 space-y-1">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3 h-3" /> 1. Bilingual (English + Hindi)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3 h-3" /> 2. 4 Plausible Options & Validated Key
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3 h-3" /> 3. Step-by-Step Deductive Explanation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section (PDF Upload + Settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PDF Upload Box (Left) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileUp className="w-5 h-5 text-emerald-400" />
                <span>Upload PDF Study Notes</span>
              </h2>
              {pdfFile && (
                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null);
                    setPdfBase64(null);
                    soundFx.playClick();
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Remove PDF
                </button>
              )}
            </div>

            {/* Warning when PDF is missing */}
            {error && (!pdfFile || !pdfBase64) && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/60 text-amber-300 text-xs flex items-center gap-2.5 shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">
                  Warning: Please input PDF first before generating questions.
                </span>
              </motion.div>
            )}

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer relative ${
                pdfFile 
                  ? 'border-emerald-500/60 bg-emerald-950/20' 
                  : error && !pdfFile
                    ? 'border-amber-500/90 bg-amber-950/20 ring-2 ring-amber-500/40'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-950/50 hover:bg-slate-950/80'
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileInputChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Upload PDF Notes"
              />

              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                {pdfFile ? (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md">
                        {pdfFile.name}
                      </p>
                      <p className="text-xs text-emerald-400/90 mt-0.5">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Synthesis
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shadow-inner">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">
                        Click to browse or drag and drop your PDF notes here
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports reasoning study sheets, lecture handouts, and syllabus notes up to 20MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Demo Sample PDF option */}
            {!pdfFile && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400">
                  Don't have notes on hand? Test with pre-loaded notes:
                </span>
                <button
                  type="button"
                  onClick={handleLoadSamplePdf}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Load Sample O-Level Notes PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Panel & Generator Action (Right) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Exam Synthesis Settings</span>
            </h2>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Number of Reasoning Questions:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[50, 100].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setQuestionCount(count);
                      soundFx.playClick();
                    }}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      questionCount === count
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{count} Qs</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Default Difficulty Indicator */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Difficulty Level:
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">O Level Difficulty</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Standard Default</span>
              </div>
            </div>

            {/* Error or Warning Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  error.toLowerCase().includes('pdf')
                    ? 'bg-amber-950/70 border-amber-500/80 text-amber-200 shadow-md shadow-amber-950/40 ring-1 ring-amber-500/30'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {error.toLowerCase().includes('pdf') ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <div className="flex-1 font-semibold leading-relaxed">
                  {error}
                </div>
              </motion.div>
            )}

            {/* Generate Action Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateQuestions}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                loading
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-emerald-600/30 hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing with AI...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  <span>Generate Reasoning Questions</span>
                </>
              )}
            </button>

            {loading && (
              <p className="text-[11px] text-center text-slate-400 animate-pulse">
                {loadingStep || 'Analyzing PDF notes & synthesizing questions...'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Questions Output Section */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-lg font-bold text-white">
                  Generated {generatedQuestions.length} Questions
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready for Exam
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Based on: <strong className="text-slate-200">{pdfFile?.name || 'Logical Reasoning Notes'}</strong>
              </p>
            </div>

            {/* Instant Practice Summary Stats */}
            <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs">
              <div className="text-center">
                <span className="block text-slate-400 text-[10px] uppercase">Attempted</span>
                <span className="font-bold text-white text-sm">
                  {Object.keys(userAnswers).length} / {generatedQuestions.length}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-center">
                <span className="block text-emerald-400 text-[10px] uppercase">Correct</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {Object.entries(userAnswers).filter(([idx, opt]) => opt === generatedQuestions[Number(idx)]?.correctIndex).length}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-center">
                <span className="block text-rose-400 text-[10px] uppercase">Incorrect</span>
                <span className="font-bold text-rose-400 text-sm">
                  {Object.entries(userAnswers).filter(([idx, opt]) => opt !== generatedQuestions[Number(idx)]?.correctIndex).length}
                </span>
              </div>
            </div>
          </div>

          {/* Export & Launch Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHindi(!showHindi)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {showHindi ? 'Show English' : 'Show Hindi (द्विभाषी)'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const allOpen = Object.keys(showExplanations).length === generatedQuestions.length && Object.values(showExplanations).every(Boolean);
                  const next: Record<number, boolean> = {};
                  generatedQuestions.forEach((_, i) => {
                    next[i] = !allOpen;
                  });
                  setShowExplanations(next);
                  soundFx.playClick();
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
              >
                {Object.values(showExplanations).filter(Boolean).length === generatedQuestions.length
                  ? 'Hide All Explanations'
                  : 'Reveal All Logic Explanations'}
              </button>

              {Object.keys(userAnswers).length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setUserAnswers({});
                    soundFx.playClick();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Reset Answers
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchPaper}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Printable Test Paper</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchCbt}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 hover:scale-[1.02] transition-all cursor-pointer ring-1 ring-emerald-400/30"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>CBT Exam Simulator</span>
              </button>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => {
              const selectedOpt = userAnswers[idx];
              const isExplanationOpen = !!showExplanations[idx];

              return (
                <div
                  key={q.id || idx}
                  className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md transition-all hover:border-slate-700"
                >
                  {/* Top Question Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {q.topic || 'Reasoning'}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {q.difficulty || 'Medium'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                      {q.questionEn}
                    </p>
                    {showHindi && q.questionHi && (
                      <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed font-sans">
                        {q.questionHi}
                      </p>
                    )}
                  </div>

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.optionsEn.map((opt, optIdx) => {
                      const optionLabel = ['A', 'B', 'C', 'D'][optIdx];
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = q.correctIndex === optIdx;

                      let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-950';

                      if (selectedOpt !== undefined) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-70';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setUserAnswers((prev) => ({ ...prev, [idx]: optIdx }));
                            soundFx.playClick();
                          }}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            selectedOpt !== undefined && isCorrect
                              ? 'bg-emerald-500 text-black'
                              : selectedOpt !== undefined && isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {optionLabel}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="block">{opt}</span>
                            {showHindi && q.optionsHi && q.optionsHi[optIdx] && (
                              <span className="block text-[11px] text-slate-400 mt-0.5">
                                {q.optionsHi[optIdx]}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle & Immediate Verification */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowExplanations((prev) => ({ ...prev, [idx]: !prev[idx] }));
                        soundFx.playClick();
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>{isExplanationOpen ? 'Hide Logic Explanation' : 'View Step-by-Step Logic Explanation'}</span>
                    </button>

                    {selectedOpt !== undefined && (
                      <span className={`text-xs font-semibold ${
                        selectedOpt === q.correctIndex ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {selectedOpt === q.correctIndex ? 'Correct! ✓' : 'Incorrect ✗'}
                      </span>
                    )}
                  </div>

                  {/* Step-by-Step Logic Explanation Box */}
                  <AnimatePresence>
                    {isExplanationOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs text-slate-300 space-y-2 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct Answer: Option {['A', 'B', 'C', 'D'][q.correctIndex || 0]}</span>
                        </div>
                        <div className="text-slate-200 leading-relaxed whitespace-pre-line">
                          {q.explanationEn}
                        </div>
                        {q.explanationHi && (
                          <div className="text-slate-400 leading-relaxed font-sans pt-1 border-t border-slate-900">
                            <span className="font-semibold text-emerald-300">तार्किक व्याख्या: </span>
                            {q.explanationHi}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
