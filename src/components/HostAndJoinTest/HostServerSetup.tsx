import React, { useState } from 'react';
import { 
  Server, 
  Layers, 
  FileText, 
  Upload, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  FileUp, 
  Laptop, 
  Globe, 
  Code, 
  Cpu, 
  ArrowRight,
  ShieldAlert,
  Shuffle,
  Lock,
  Zap,
  Sliders,
  ShieldCheck,
  Eye,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { ModuleId, Question, TestConfiguration, LiveTestSession } from '../../types';
import { MODULES_INFO } from '../../data/syllabus';
import { generateTestPaper } from '../../data/testGenerator';
import { soundFx } from '../../utils/audio';
import { SAMPLE_REASONING_PDF_NAME, SAMPLE_REASONING_PDF_BASE64 } from '../../data/sampleReasoningPdf';
import { motion } from 'motion/react';

const MODULE_OPTIONS: { id: ModuleId; label: string; code: string; icon: React.ElementType; color: string }[] = [
  { id: 'M1', label: 'IT Tools & Network Basics', code: 'M1-R5.1', icon: Laptop, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  { id: 'M2', label: 'Web Designing & Publishing', code: 'M2-R5.1', icon: Globe, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { id: 'M3', label: 'Programming & Python', code: 'M3-R5.1', icon: Code, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' },
  { id: 'M4', label: 'Internet of Things (IoT)', code: 'M4-R5.1', icon: Cpu, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
];

interface HostServerSetupProps {
  onServerCreated: (data: { testId: string; hostToken: string; session: LiveTestSession }) => void;
  onCancel?: () => void;
  activeCount?: number;
}

export const HostServerSetup: React.FC<HostServerSetupProps> = ({ onServerCreated, onCancel, activeCount = 0 }) => {
  // Host Details
  const [hostName, setHostName] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');

  // Primary Sub-Option: Option 1 (Exam Generator) vs Option 2 (PDF Notes)
  const [hostMode, setHostMode] = useState<'exam_generator' | 'pdf_notes'>('exam_generator');

  // Option 1: Exam Generator States
  const [selectedModule, setSelectedModule] = useState<ModuleId>('M1');
  const [testType, setTestType] = useState<'standard' | 'chapter_wise'>('standard');
  const [selectedChapters, setSelectedChapters] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [egQuestionCount, setEgQuestionCount] = useState<100 | 50>(100);
  const [egDuration, setEgDuration] = useState<number>(90);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);

  // Option 2: PDF Notes States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [pdfQuestionCount, setPdfQuestionCount] = useState<50 | 100>(50);
  const [pdfDuration, setPdfDuration] = useState<number>(45);

  // Exam Security & Proctoring Settings
  const [passcode, setPasscode] = useState('');
  const [allowLateJoiners, setAllowLateJoiners] = useState(true);
  const [showImmediateResults, setShowImmediateResults] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState<0 | 0.25>(0);

  // Processing state
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeModuleInfo = MODULES_INFO[selectedModule];

  // Handle module change
  const handleModuleChange = (modId: ModuleId) => {
    soundFx.playClick();
    setSelectedModule(modId);
    const mod = MODULES_INFO[modId];
    setSelectedChapters(Array.from({ length: mod.totalChapters }, (_, i) => i + 1));
  };

  // Toggle chapter
  const toggleChapter = (chapNum: number) => {
    soundFx.playClick(600, 0.03);
    setSelectedChapters((prev) => {
      if (prev.includes(chapNum)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((n) => n !== chapNum);
      } else {
        return [...prev, chapNum].sort((a, b) => a - b);
      }
    });
  };

  // Select all chapters
  const handleSelectAllChapters = () => {
    soundFx.playClick();
    const mod = MODULES_INFO[selectedModule];
    setSelectedChapters(Array.from({ length: mod.totalChapters }, (_, i) => i + 1));
  };

  // Handle PDF file upload
  const handleFileUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a valid PDF document.');
      return;
    }
    setErrorMessage(null);
    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setPdfBase64(b64);
      soundFx.playSuccess();
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Load Sample PDF Notes
  const handleLoadSamplePdf = () => {
    setErrorMessage(null);
    const mockFile = new File(
      [new Blob(['Sample NIELIT O-Level Notes'], { type: 'application/pdf' })],
      SAMPLE_REASONING_PDF_NAME,
      { type: 'application/pdf' }
    );
    setPdfFile(mockFile);
    setPdfBase64(SAMPLE_REASONING_PDF_BASE64);
    soundFx.playSuccess();
  };

  // Create Server Action
  const handleCreateServer = async () => {
    setErrorMessage(null);
    soundFx.playClick();

    // Check PDF requirement first if in PDF mode
    if (hostMode === 'pdf_notes' && !pdfBase64 && !pdfFile) {
      setErrorMessage('Input PDF first.');
      soundFx.playWarning();
      return;
    }

    setIsCreating(true);

    try {
      let questions: Question[] = [];
      let finalTitle = sessionTitle.trim();
      let subOptionTitle = '';

      if (hostMode === 'exam_generator') {
        setStatusMessage('Synthesizing questions from NIELIT Curriculum & Question Bank...');
        const config: TestConfiguration = {
          moduleId: selectedModule,
          testType,
          selectedChapters,
          questionCount: egQuestionCount,
          durationMinutes: egDuration as any,
          bookletSeries: 'A',
          sourceFilter: 'all',
          shuffleQuestions,
          shuffleOptions,
          includeAnswerKey: true,
          includeExplanations: true,
          includeOMRSheet: true
        };

        const generated = generateTestPaper(config);
        questions = generated.questions;
        if (!finalTitle) {
          finalTitle = `NIELIT ${activeModuleInfo.code} ${activeModuleInfo.title} Examination`;
        }
        subOptionTitle = `Option 1: Exam Generator (${activeModuleInfo.code})`;
      } else {
        // Option 2: PDF Notes - Questions must be generated solely from the uploaded PDF notes
        if (!pdfBase64) {
          throw new Error('Please upload your PDF study notes first. Questions must be generated solely from the uploaded PDF notes.');
        }

        setStatusMessage(`Analyzing uploaded PDF notes & synthesizing ${pdfQuestionCount} questions solely from PDF content...`);

        const response = await fetch('/api/generate-pdf-reasoning-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64: pdfBase64,
            count: pdfQuestionCount
          })
        });

        const responseData = await response.json();
        if (!response.ok || !responseData.questions || responseData.questions.length === 0) {
          throw new Error(responseData.error || 'Failed to generate questions solely from the uploaded PDF notes.');
        }

        questions = responseData.questions.map((q: any, idx: number) => ({
          id: `HOST-PDF-${Date.now()}-${idx + 1}`,
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
          explanationEn: q.explanationEn || 'Grounded in uploaded PDF study notes.',
          explanationHi: q.explanationHi,
          source: 'ai_generated',
          sourceLabel: 'Solely Generated from Uploaded PDF Notes'
        }));

        if (!finalTitle) {
          finalTitle = `NIELIT O Level PDF Notes Test (${pdfFile?.name ? pdfFile.name.replace(/\.[^/.]+$/, '') : 'Study Notes'})`;
        }
        subOptionTitle = `Option 2: PDF Notes (${pdfQuestionCount} Questions)`;
      }

      setStatusMessage('Provisioning live test server & generating unique Test ID...');

      const durationMinutes = hostMode === 'exam_generator' ? egDuration : pdfDuration;
      const questionCount = questions.length;

      let serverData: any = null;
      try {
        const serverRes = await fetch('/api/live-tests/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hostName: hostName.trim() || 'Examiner',
            title: finalTitle,
            subOptionTitle,
            mode: hostMode,
            durationMinutes,
            questionCount,
            passcode: passcode.trim() || undefined,
            allowLateJoiners,
            showImmediateResults,
            negativeMarking,
            config: {
              hostMode,
              selectedModule: hostMode === 'exam_generator' ? selectedModule : undefined,
              selectedChapters: hostMode === 'exam_generator' ? selectedChapters : undefined,
              passcode: passcode.trim() ? 'enabled' : 'none'
            },
            questions
          })
        });

        if (serverRes.ok) {
          serverData = await serverRes.json();
        }
      } catch (postErr) {
        console.warn('Network call to /api/live-tests/create failed, using local session generator:', postErr);
      }

      // If backend was reachable and returned testId
      if (serverData && serverData.success && serverData.testId) {
        soundFx.playSuccess();
        onServerCreated({
          testId: serverData.testId,
          hostToken: serverData.hostToken,
          session: serverData.session
        });
        return;
      }

      // Resilient fallback session in case backend returned error or was offline
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
      const fallbackTestId = `NL-${randomLetter()}${randomLetter()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackToken = `ht_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const fallbackSession: LiveTestSession = {
        testId: fallbackTestId,
        hostName: hostName.trim() || 'Examiner',
        hostToken: fallbackToken,
        title: finalTitle,
        subOptionTitle,
        mode: hostMode,
        status: 'waiting',
        createdAt: new Date().toISOString(),
        durationMinutes,
        questionCount: questions.length,
        config: { hostMode },
        passcode: passcode.trim() || undefined,
        allowLateJoiners,
        showImmediateResults,
        negativeMarking,
        proctoringAlerts: [],
        questions,
        students: {}
      };

      soundFx.playSuccess();
      onServerCreated({
        testId: fallbackTestId,
        hostToken: fallbackToken,
        session: fallbackSession
      });
    } catch (err: any) {
      console.error('Host creation error:', err);
      setErrorMessage(err.message || 'An error occurred while creating the server.');
      soundFx.playWarning();
    } finally {
      setIsCreating(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Heading with Breadcrumb / Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <PlusCircle className="w-3 h-3 text-blue-400" />
              Host New Test
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-medium">Server Configuration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Host a New Live Test
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Configure an examination server using standard syllabus modules or uploaded PDF notes. You will receive a unique Test ID that students use to join your synchronized session.
          </p>
        </div>

        {onCancel && activeCount > 0 && (
          <button
            type="button"
            onClick={onCancel}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Return to Active Room</span>
          </button>
        )}
      </div>

      {/* Quick Exam Presets */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Quick Exam Presets (1-Click Setup)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Click to pre-fill settings</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setHostMode('exam_generator');
              handleModuleChange('M1');
              setTestType('standard');
              setEgQuestionCount(100);
              setEgDuration(90);
              setSessionTitle('NIELIT M1-R5.1 Information Technology Tools and Network Basics Mock Exam');
            }}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                M1 IT Tools
              </span>
              <span className="text-[10px] text-slate-500 font-mono">100 Qs</span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight line-clamp-2">
              Information Technology Tools and Network Basics
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">90 Mins • Complete</p>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setHostMode('exam_generator');
              handleModuleChange('M3');
              setTestType('standard');
              setEgQuestionCount(50);
              setEgDuration(45);
              setSessionTitle('NIELIT M3-R5.1 Python Speed Diagnostic');
            }}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                M3 Python
              </span>
              <span className="text-[10px] text-slate-500 font-mono">50 Qs</span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Python Speed Quiz
            </p>
            <p className="text-[11px] text-slate-400">45 Mins • Core</p>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setHostMode('exam_generator');
              handleModuleChange('M2');
              setTestType('standard');
              setEgQuestionCount(50);
              setEgDuration(45);
              setSessionTitle('NIELIT M2-R5.1 Web Design Live Test');
            }}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                M2 Web Design
              </span>
              <span className="text-[10px] text-slate-500 font-mono">50 Qs</span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              Web Assessment
            </p>
            <p className="text-[11px] text-slate-400">45 Mins • HTML/JS</p>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setHostMode('exam_generator');
              handleModuleChange('M4');
              setTestType('standard');
              setEgQuestionCount(50);
              setEgDuration(45);
              setSessionTitle('NIELIT M4-R5.1 Internet of Things (IoT) and its Applications Live Test');
            }}
            className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-teal-500/50 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                M4 IoT
              </span>
              <span className="text-[10px] text-slate-500 font-mono">50 Qs</span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors leading-tight line-clamp-2">
              Internet of Things (IoT) and its Applications
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">45 Mins • Sensors & Protocols</p>
          </button>
        </div>
      </div>

      {/* Host / Examiner Identity Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          1. Examiner &amp; Session Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Host / Examiner Name
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-base sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-600 transition-all duration-200 font-medium shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Custom Exam Title <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="e.g. NIELIT O Level Mid-Term Mock 2026"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Primary Sub-Option Selector */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          2. Choose Test Generation Mode
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sub-Option 1 */}
          <button
            type="button"
            onClick={() => {
              setHostMode('exam_generator');
              soundFx.playClick();
            }}
            className={`p-5 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              hostMode === 'exam_generator'
                ? 'bg-blue-600/15 border-blue-500 shadow-xl shadow-blue-500/10'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                hostMode === 'exam_generator'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                Option 1
              </span>
            </div>

            <div className="mt-4 space-y-1.5">
              <h4 className="text-base font-bold text-white">
                Exam Generator Mode
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create a test by selecting modules (M1–M4), choosing individual chapters, and adjusting question counts (50 or 100).
              </p>
            </div>
          </button>

          {/* Sub-Option 2 */}
          <button
            type="button"
            onClick={() => {
              setHostMode('pdf_notes');
              soundFx.playClick();
            }}
            className={`p-5 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              hostMode === 'pdf_notes'
                ? 'bg-emerald-600/15 border-emerald-500 shadow-xl shadow-emerald-500/10'
                : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <FileUp className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                hostMode === 'pdf_notes'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                Option 2
              </span>
            </div>

            <div className="mt-4 space-y-1.5">
              <h4 className="text-base font-bold text-white">
                PDF Notes Mode
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload custom PDF study notes to synthesize a 50- or 100-question test and configure the time limit for candidates.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Sub-Option 1 Body: Exam Generator */}
      {hostMode === 'exam_generator' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl"
        >
          {/* Module Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select NIELIT Module
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {MODULE_OPTIONS.map((mod) => {
                const Icon = mod.icon;
                const isSelected = selectedModule === mod.id;

                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleModuleChange(mod.id)}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 ${
                      isSelected
                        ? `${mod.color} shadow-lg ring-1 ring-white/20`
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-white">{mod.code}</span>
                      </div>
                      <p className="text-[11px] sm:text-xs truncate font-medium">{mod.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Type: Standard vs Chapter-Wise */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Syllabus Scope &amp; Chapters ({selectedChapters.length}/{activeModuleInfo.totalChapters})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTestType('standard');
                    handleSelectAllChapters();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    testType === 'standard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Full Syllabus
                </button>
                <button
                  type="button"
                  onClick={() => setTestType('chapter_wise')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    testType === 'chapter_wise'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Custom Chapters
                </button>
              </div>
            </div>

            {/* Chapters Pill Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-950/50 rounded-2xl border border-slate-800/80">
              {activeModuleInfo.chapters.map((chap) => {
                const isChecked = selectedChapters.includes(chap.number);

                return (
                  <button
                    key={chap.number}
                    type="button"
                    onClick={() => toggleChapter(chap.number)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600/20 border-blue-500/60 text-white'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      isChecked ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {chap.number}
                    </div>
                    <span className="truncate flex-1">{chap.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count & Duration Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Number of Questions
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEgQuestionCount(100);
                    setEgDuration(90);
                    soundFx.playClick();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    egQuestionCount === 100
                      ? 'bg-blue-600 text-white border-blue-500 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm">100 Questions</p>
                  <p className="text-[11px] opacity-75">90 Minutes (Standard)</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEgQuestionCount(50);
                    setEgDuration(45);
                    soundFx.playClick();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    egQuestionCount === 50
                      ? 'bg-blue-600 text-white border-blue-500 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm">50 Questions</p>
                  <p className="text-[11px] opacity-75">45 Minutes (Short)</p>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Examination Time Limit (Minutes)
              </label>
              <div className="flex items-center gap-2">
                {[30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setEgDuration(mins);
                      soundFx.playClick();
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      egDuration === mins
                        ? 'bg-cyan-500 text-black border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sub-Option 2 Body: PDF Notes */}
      {hostMode === 'pdf_notes' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl"
        >
          {/* PDF Upload Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Upload PDF Study Notes
            </label>

            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-950/60 relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                {pdfFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {pdfFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to synthesize questions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-200">
                      Drop notes PDF here or click to browse
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports NIELIT syllabus notes, logical reasoning handouts, and conceptual guides
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Demo Pre-loaded PDF button */}
            {!pdfFile && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">
                  Don't have notes on hand? Test with pre-loaded notes:
                </span>
                <button
                  type="button"
                  onClick={handleLoadSamplePdf}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Load Sample O-Level Notes PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Question Count: 50 or 100 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Generate Question Count
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPdfQuestionCount(50);
                    setPdfDuration(45);
                    soundFx.playClick();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    pdfQuestionCount === 50
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm">50 Questions</p>
                  <p className="text-[11px] opacity-75">45 Minutes</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPdfQuestionCount(100);
                    setPdfDuration(90);
                    soundFx.playClick();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    pdfQuestionCount === 100
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm">100 Questions</p>
                  <p className="text-[11px] opacity-75">90 Minutes</p>
                </button>
              </div>
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Time Limit (Minutes)
              </label>
              <div className="flex items-center gap-2">
                {[30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setPdfDuration(mins);
                      soundFx.playClick();
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      pdfDuration === mins
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section 3: Exam Security & Proctoring Controls */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Exam Security &amp; Proctoring Rules
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure room access, anti-cheat detection, and score publication.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
            Host Authority
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Passcode Protection */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Room Passcode / PIN</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Optional</span>
            </div>
            <input
              type="text"
              maxLength={8}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="e.g. 2026 or leave blank for open room"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 uppercase tracking-widest"
            />
            <p className="text-[11px] text-slate-500">
              {passcode.trim() 
                ? '🔒 Candidates must enter this PIN to join the lobby.' 
                : '🔓 Open room: Anyone with the Test ID can join.'}
            </p>
          </div>

          {/* Negative Marking */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Marking Scheme</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setNegativeMarking(0);
                  soundFx.playClick();
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  negativeMarking === 0
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Standard (+1 / 0)
              </button>
              <button
                type="button"
                onClick={() => {
                  setNegativeMarking(0.25);
                  soundFx.playClick();
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  negativeMarking === 0.25
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Negative (-0.25)
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {negativeMarking === 0 
                ? 'Standard NIELIT grading: No penalty for incorrect answers.'
                : 'Competitive mode: 0.25 marks deducted per wrong answer.'}
            </p>
          </div>

          {/* Allow Late Joiners */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Allow Late Joiners</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Can students join once the host clicks "Start Test"?
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAllowLateJoiners(!allowLateJoiners);
                soundFx.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                allowLateJoiners
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {allowLateJoiners ? 'Allowed' : 'Locked on Start'}
            </button>
          </div>

          {/* Immediate Results */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>Immediate Candidate Results</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Show score &amp; solutions right when candidate submits.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowImmediateResults(!showImmediateResults);
                soundFx.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showImmediateResults
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {showImmediateResults ? 'Instant' : 'Host Release Only'}
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Live Test Summary & Student Invite Preview */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              4. Live Server Specification &amp; Invite Preview
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Ready to Deploy</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-500">Examiner / Host</p>
            <p className="text-xs sm:text-sm font-bold text-white truncate">{hostName.trim() || 'Your Name'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-500">Generation Mode</p>
            <p className="text-xs sm:text-sm font-bold text-cyan-300 truncate">
              {hostMode === 'exam_generator' ? 'Option 1: Exam Generator' : 'Option 2: PDF Notes'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-500">Test Size</p>
            <p className="text-xs sm:text-sm font-bold text-amber-300">
              {hostMode === 'exam_generator' ? egQuestionCount : pdfQuestionCount} Qs • {hostMode === 'exam_generator' ? egDuration : pdfDuration} Mins
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-500">Access Security</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-300">
              {passcode.trim() ? `PIN: ${passcode}` : 'Open (Test ID only)'}
            </p>
          </div>
        </div>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Primary Server Provisioning Button */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={handleCreateServer}
          disabled={isCreating}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 transition-all"
        >
          <Server className="w-5 h-5" />
          <span>{isCreating ? 'Provisioning Live Server...' : 'Create Test Server & Get Test ID'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {isCreating && (
          <p className="text-center text-xs text-cyan-300 animate-pulse">
            {statusMessage || 'Configuring server...'}
          </p>
        )}
      </div>
    </div>
  );
};
