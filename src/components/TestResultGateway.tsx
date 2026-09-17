import React, { useState, useMemo } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Printer, 
  RotateCcw, 
  FileText, 
  User, 
  Hash, 
  ArrowLeft, 
  ShieldCheck, 
  BarChart3, 
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { GeneratedTest, TestResult } from '../types';
import { calculateTestResult } from '../data/testGenerator';

interface TestResultGatewayProps {
  test: GeneratedTest;
  userAnswers: Record<number, number>;
  timeSpentSeconds: number;
  onBackToPaper: () => void;
  onConfigureNew: () => void;
  initialCandidateName?: string;
  initialRollNumber?: string;
}

export const TestResultGateway: React.FC<TestResultGatewayProps> = ({
  test,
  userAnswers,
  timeSpentSeconds,
  onBackToPaper,
  onConfigureNew,
  initialCandidateName,
  initialRollNumber
}) => {
  const [candidateName, setCandidateName] = useState(initialCandidateName || test.config.candidateName || '');
  const [rollNumber, setRollNumber] = useState(initialRollNumber || test.config.rollNumber || '');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct' | 'unattempted'>('all');
  const [showHindi, setShowHindi] = useState(true);

  const optionLetters = ['(A)', '(B)', '(C)', '(D)'];

  // Calculate result based on confirmed candidate credentials
  const res: TestResult = useMemo(() => {
    const finalName = candidateName.trim() || 'Candidate';
    const finalRoll = rollNumber.trim() || '000000000';
    return calculateTestResult(
      test,
      userAnswers,
      timeSpentSeconds,
      finalName,
      finalRoll
    );
  }, [test, userAnswers, timeSpentSeconds, candidateName, rollNumber]);

  const isPassed = res.grade !== 'F';

  // Handle unlocking result upon roll number & name verification
  const handleUnlockResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      setInputError('Please enter the Candidate Full Name to view and print your result.');
      return;
    }
    if (!rollNumber.trim()) {
      setInputError('Please enter your Roll Number / Registration No. to view and print your result.');
      return;
    }
    setInputError(null);
    setIsUnlocked(true);
  };

  // Filter questions for detailed breakdown
  const filteredQuestions = useMemo(() => {
    return test.questions.map((q, idx) => ({ q, idx })).filter(({ q, idx }) => {
      const chosen = userAnswers[idx];
      const isUnattempted = chosen === undefined || chosen === -1;
      const isCorrect = chosen === (q.correctIndex ?? q.correctAnswer);
      const isWrong = !isUnattempted && !isCorrect;

      if (filterMode === 'incorrect') return isWrong;
      if (filterMode === 'correct') return isCorrect;
      if (filterMode === 'unattempted') return isUnattempted;
      return true;
    });
  }, [test.questions, userAnswers, filterMode]);

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  // =========================================================================
  // GATEWAY VERIFICATION SCREEN (Prompted on submission before viewing/printing)
  // =========================================================================
  if (!isUnlocked) {
    const totalAttempted = Object.keys(userAnswers).length;

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 text-center space-y-3 relative overflow-hidden">
            <div className="w-14 h-14 bg-blue-600/30 border border-blue-400/40 rounded-2xl flex items-center justify-center mx-auto text-cyan-300 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                NIELIT Examination Result Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Enter Candidate Credentials
              </h2>
              <p className="text-xs text-slate-300 font-hindi">
                परिणाम एवं अंकतालिका देखने व प्रिंट करने के लिए कृपया अपना नाम व अनुक्रमांक दर्ज करें
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-lg font-mono font-bold border border-blue-400/30">
                {test.moduleCode}
              </span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg font-mono border border-slate-700">
                Series {test.config.bookletSeries}
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-400/30 font-medium">
                {totalAttempted}/{test.questions.length} Attempted
              </span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleUnlockResult} className="p-6 sm:p-8 space-y-5 bg-slate-50/50">
            {inputError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{inputError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Candidate Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Candidate Full Name (अभ्यर्थी का पूरा नाम)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="candidate-name-input"
                    value={candidateName}
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="Enter Candidate Full Name (e.g. Rahul Sharma)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-900 bg-white shadow-xs outline-none transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  This name will appear on your official Statement of Marks and Certificate.
                </p>
              </div>

              {/* Roll Number / Registration Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  Roll Number / Registration No. (अनुक्रमांक)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="roll-number-input"
                    value={rollNumber}
                    onChange={(e) => {
                      setRollNumber(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="Enter Roll / Reg No. (e.g. 240182749)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-mono font-bold text-slate-900 bg-white shadow-xs outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Your 9-digit official examination roll number or registration code.
                </p>
              </div>
            </div>

            {/* Verification Security Note */}
            <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Official Evaluation Policy
              </p>
              <p className="text-blue-800/90 leading-relaxed">
                Test results and printable marksheets are protected and generated strictly upon student identity submission.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                id="unlock-result-submit-btn"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Generate Official Result / Marksheet</span>
              </button>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onBackToPaper}
                  className="flex-1 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Review Questions First
                </button>
                <button
                  type="button"
                  onClick={onConfigureNew}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Configure New Test
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 px-2 sm:px-4">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-20 z-30">
        <div className="flex items-center gap-2">
          <button
            id="print-marksheet-btn"
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Official Marksheet / PDF
          </button>

          <button
            type="button"
            onClick={() => setIsUnlocked(false)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Change Candidate Name or Roll Number"
          >
            <User className="w-4 h-4 text-slate-600" />
            <span>Edit Roll / Name</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHindi(!showHindi)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              showHindi ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            Bilingual Explanations
          </button>

          <button
            type="button"
            onClick={onBackToPaper}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            Review Exam
          </button>

          <button
            type="button"
            onClick={onConfigureNew}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Test
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* OFFICIAL MARKSHEET CARD                                               */}
      {/* ===================================================================== */}
      <div className="print-area bg-white text-slate-900 shadow-lg sm:rounded-2xl border border-slate-300 p-6 sm:p-10 font-sans space-y-6">
        
        {/* NIELIT Official Header */}
        <div className="border-b-4 border-slate-900 pb-4 text-center space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-200 pb-1 mb-2">
            <span>Certificate Verification Ref: <strong className="text-slate-900 font-mono font-bold">{res.rollNumber}</strong></span>
            <span>NIELIT 'O' Level Examination Result</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-mono text-xs font-bold">
              SERIES: {test.config.bookletSeries}
            </span>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">
            राष्ट्रीय इलेक्ट्रॉनिकी एवं सूचना प्रौद्योगिकी संस्थान (रा.इ.सू.प्रौ.सं.)
          </p>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
            National Institute of Electronics and Information Technology
          </h1>
          <p className="text-xs text-slate-600">
            (An Autonomous Scientific Society of Ministry of Electronics and Information Technology, Govt. of India)
          </p>
          
          <div className="pt-2">
            <h2 className="text-base sm:text-lg font-bold text-blue-900 uppercase">
              OFFICIAL STATEMENT OF MARKS & RESULT REPORT
            </h2>
            <p className="text-xs font-bold text-slate-800">
              COURSE: NIELIT 'O' LEVEL (REVISION 5.1) • MODULE: {test.moduleCode} ({test.moduleTitle})
            </p>
          </div>
        </div>

        {/* Candidate Information Grid */}
        <div className="border-2 border-slate-800 rounded-xl p-4 bg-slate-50/70 text-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">CANDIDATE NAME / अभ्यर्थी का नाम:</span>
              <span className="font-bold text-slate-900 text-sm uppercase">{res.candidateName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">ROLL NUMBER / अनुक्रमांक:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{res.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">TEST MODULE / प्रश्न पत्र:</span>
              <span className="font-bold text-slate-900 text-sm">{test.moduleCode} — Series {test.config.bookletSeries}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">EXAMINATION DATE / परीक्षा तिथि:</span>
              <span className="font-medium text-slate-800">{new Date(res.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">TIME TAKEN / समय:</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {formatTime(res.timeSpentSeconds)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[11px]">EXAM CENTER / केंद्र:</span>
              <span className="font-medium text-slate-800">{res.centerName}</span>
            </div>
          </div>
        </div>

        {/* Grade & Score Summary Banner */}
        <div className={`rounded-2xl p-6 border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${
          isPassed ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-emerald-400' : 'bg-red-50 border-red-300'
        }`}>
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isPassed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {isPassed ? 'QUALIFIED / PASS' : 'NEEDS IMPROVEMENT / FAIL'}
              </span>
              <span className="text-xs font-bold text-slate-600">NIELIT Result Status</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {res.gradeTitle}
            </h3>
            <p className="text-xs text-slate-600 max-w-md">
              Score: <strong className="text-slate-900 font-mono text-sm">{res.score} / {res.maxScore}</strong> marks ({res.percentage}% aggregate percentage).
            </p>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Grade</span>
              <span className={`text-3xl font-extrabold font-mono ${
                res.grade === 'S' ? 'text-purple-600' :
                res.grade === 'A' ? 'text-emerald-600' :
                res.grade === 'B' ? 'text-blue-600' :
                res.grade === 'C' ? 'text-amber-600' :
                res.grade === 'D' ? 'text-slate-700' : 'text-red-600'
              }`}>
                {res.grade}
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Percentage</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {res.percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Score Metrics Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Questions</span>
            <span className="text-xl font-bold font-mono text-slate-900">{res.totalQuestions}</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-700 block">Correct (Right)</span>
            <span className="text-xl font-bold font-mono text-emerald-800">+{res.correctCount}</span>
          </div>

          <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
            <span className="text-[11px] font-semibold text-red-700 block">Incorrect (Wrong)</span>
            <span className="text-xl font-bold font-mono text-red-800">-{res.incorrectCount}</span>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-700 block">Unattempted</span>
            <span className="text-xl font-bold font-mono text-amber-800">{res.unattemptedCount}</span>
          </div>
        </div>

        {/* Chapter Breakdown */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Chapter-Wise Syllabus Performance Breakdown
          </h4>

          <div className="space-y-2">
            {res.chapterBreakdown.map((chap) => (
              <div key={chap.chapterNumber} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-800">
                    Ch.{chap.chapterNumber}: {chap.chapterName}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">✓ {chap.correct}</span>
                    <span className="text-red-600 font-bold">✗ {chap.incorrect}</span>
                    <span className="text-slate-400">Total: {chap.total}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      {chap.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      chap.percentage >= 75 ? 'bg-emerald-500' :
                      chap.percentage >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.max(5, chap.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* DETAILED QUESTIONS REVIEW                                             */}
        {/* ===================================================================== */}
        <div className="pt-4 border-t border-slate-300 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Detailed Solutions & Marked Options Review
            </h4>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All ({test.questions.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('incorrect')}
                className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMode === 'incorrect'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Incorrect ({res.incorrectCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('correct')}
                className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMode === 'correct'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Correct ({res.correctCount})
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('unattempted')}
                className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                  filterMode === 'unattempted'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                Unattempted ({res.unattemptedCount})
              </button>
            </div>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                No questions found under the "{filterMode}" filter.
              </div>
            ) : (
              filteredQuestions.map(({ q, idx }) => {
                const chosen = userAnswers[idx];
                const isUnattempted = chosen === undefined || chosen === -1;
                const correctIdx = q.correctIndex ?? q.correctAnswer;
                const isCorrect = chosen === correctIdx;
                const isWrong = !isUnattempted && !isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2.5 transition-colors ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isWrong
                        ? 'bg-red-50/40 border-red-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <span>Q.{idx + 1}.</span>
                        {isCorrect && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Correct
                          </span>
                        )}
                        {isWrong && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-800 bg-red-100 px-2 py-0.5 rounded-full font-bold">
                            <XCircle className="w-3 h-3 text-red-700" /> Incorrect
                          </span>
                        )}
                        {isUnattempted && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full font-bold">
                            Unattempted
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        [Ch.{q.chapterNumber} • {q.sourceLabel}]
                      </span>
                    </div>

                    {/* Question Text */}
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug">
                      {q.questionEn}
                    </p>
                    {showHindi && q.questionHi && (
                      <p className="text-slate-700 text-xs font-hindi leading-snug">
                        {q.questionHi}
                      </p>
                    )}

                    {/* Options Breakdown */}
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {q.optionsEn.map((optEn, optIdx) => {
                        const optHi = q.optionsHi ? q.optionsHi[optIdx] : null;
                        const isThisCorrect = optIdx === correctIdx;
                        const isThisUserMarked = optIdx === chosen;

                        let style = 'bg-white border-slate-200 text-slate-800';
                        if (isThisCorrect) {
                          style = 'bg-emerald-100/90 border-emerald-400 text-emerald-900 font-semibold';
                        } else if (isThisUserMarked && !isThisCorrect) {
                          style = 'bg-red-100/90 border-red-400 text-red-900 font-semibold';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${style}`}
                          >
                            <span className="font-mono font-bold w-6 shrink-0">
                              {optionLetters[optIdx]}
                            </span>
                            <div className="flex-1">
                              <span>{optEn}</span>
                              {showHindi && optHi && optHi !== optEn && (
                                <span className="block text-[11px] font-hindi text-slate-600 mt-0.5">
                                  {optHi}
                                </span>
                              )}
                            </div>
                            {isThisCorrect && (
                              <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shrink-0">
                                Correct Answer
                              </span>
                            )}
                            {isThisUserMarked && !isThisCorrect && (
                              <span className="text-[10px] bg-red-700 text-white font-bold px-2 py-0.5 rounded shrink-0">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">
                        Explanation: <span className="font-normal text-slate-700">{q.explanationEn}</span>
                      </p>
                      {showHindi && q.explanationHi && (
                        <p className="font-hindi text-slate-600">
                          व्याख्या: {q.explanationHi}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Official Marksheet Footer Notice with Author Attribution */}
        <div className="pt-6 border-t border-slate-300 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            NIELIT 'O' Level Examination Portal • Developed by Arham Ahmad Khan
          </p>
          <p className="text-[11px] text-slate-400">
            Copyright © 2026 Arham Ahmad Khan. All rights reserved. • Computer-generated scorecard for self-evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};
