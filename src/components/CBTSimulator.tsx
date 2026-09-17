import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  AlertCircle, 
  Bookmark, 
  RotateCcw, 
  Award, 
  User, 
  Hash, 
  FileText, 
  Languages, 
  CheckSquare, 
  Zap,
  Sparkles,
  LayoutGrid,
  X
} from 'lucide-react';
import { GeneratedTest } from '../types';
import { generateSampleUserAnswers } from '../data/testGenerator';
import { TestResultGateway } from './TestResultGateway';

interface CBTSimulatorProps {
  test: GeneratedTest;
  onExit: () => void;
  onSwitchToPaper?: () => void;
}

export const CBTSimulator: React.FC<CBTSimulatorProps> = ({
  test,
  onExit,
  onSwitchToPaper
}) => {
  const totalQuestions = test.questions.length;
  const initialDurationSeconds = (test.config.durationMinutes || 90) * 60;

  // CBT State
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  
  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  
  // UI & Submission State
  const [showHindi, setShowHindi] = useState<boolean>(true);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mark current as visited on navigation
  useEffect(() => {
    setVisitedQuestions((prev) => {
      const next = new Set(prev);
      next.add(currentIdx);
      return next;
    });
  }, [currentIdx]);

  // Countdown timer effect
  useEffect(() => {
    if (isSubmitted || !isTimerRunning) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, isTimerRunning]);

  const timeSpentSeconds = initialDurationSeconds - secondsRemaining;

  const handleForceSubmit = () => {
    setShowSubmitModal(false);
    setIsSubmitted(true);
  };

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIndex
    }));
  };

  const handleClearResponse = () => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const handleToggleMarkReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentIdx)) {
        next.delete(currentIdx);
      } else {
        next.add(currentIdx);
      }
      return next;
    });
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleMarkReviewAndNext = () => {
    handleToggleMarkReview();
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  // Autofill for instant demo / grading testing
  const handleAutofill = () => {
    const samples = generateSampleUserAnswers(test.questions, 0.78);
    setUserAnswers(samples);
    const allSet = new Set<number>();
    for (let i = 0; i < totalQuestions; i++) allSet.add(i);
    setVisitedQuestions(allSet);
  };

  // Palette status calculation
  const getQuestionStatus = (idx: number) => {
    const isAnswered = userAnswers[idx] !== undefined;
    const isReview = markedForReview.has(idx);
    const isVisited = visitedQuestions.has(idx);

    if (isAnswered && isReview) return 'answered_review';
    if (isReview) return 'review';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not_answered';
    return 'not_visited';
  };

  // Count summaries
  const answeredCount = Object.keys(userAnswers).length;
  const reviewCount = markedForReview.size;
  const notVisitedCount = totalQuestions - visitedQuestions.size;
  const notAnsweredCount = totalQuestions - answeredCount;

  // Format timer
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If submitted, show the Result Gateway (Verification Screen -> Result View)
  if (isSubmitted) {
    return (
      <TestResultGateway
        test={test}
        userAnswers={userAnswers}
        timeSpentSeconds={timeSpentSeconds}
        onBackToPaper={() => setIsSubmitted(false)}
        onConfigureNew={onExit}
        initialCandidateName={test.config.candidateName}
        initialRollNumber={test.config.rollNumber}
      />
    );
  }

  const currentQ = test.questions[currentIdx];
  const optionLetters = ['(A)', '(B)', '(C)', '(D)'];

  return (
    <div ref={containerRef} className="space-y-4 pb-28 md:pb-6">
      {/* Top Header Bar of CBT Simulator */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Module Details & Candidate Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Return to Test Generator"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Exam</span>
          </button>
          <div className="border-l border-slate-700 pl-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-xs">
                {test.moduleCode}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                {test.moduleTitle}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>Candidate: <strong className="text-slate-200">{test.config.candidateName || 'Rahul Sharma'}</strong></span>
              <span>•</span>
              <span>Roll: <strong className="text-slate-200 font-mono">{test.config.rollNumber || '240182749'}</strong></span>
              <span>•</span>
              <span>Series: <strong className="text-amber-400 font-mono">'{test.config.bookletSeries}'</strong></span>
            </div>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            {/* Mobile Palette Trigger */}
            <button
              type="button"
              onClick={() => setMobilePaletteOpen(true)}
              className="lg:hidden min-h-[38px] px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/40 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Open Question Palette"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Palette ({answeredCount}/{totalQuestions})</span>
            </button>

            {/* Autofill Demo button */}
            <button
              onClick={handleAutofill}
              className="min-h-[38px] px-2.5 py-1.5 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Autofill questions for rapid grading verification"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Autofill</span>
            </button>

            {/* Hindi/English Toggle */}
            <button
              onClick={() => setShowHindi(!showHindi)}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 cursor-pointer transition-colors ${
                showHindi 
                  ? 'bg-blue-900/60 border-blue-500 text-blue-200' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showHindi ? 'Bilingual (HI+EN)' : 'English Only'}</span>
              <span className="sm:hidden">{showHindi ? 'HI+EN' : 'EN'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer Display */}
            <div className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm shadow-inner ${
              secondsRemaining < 300
                ? 'bg-red-950/80 border-red-600 text-red-400 animate-pulse'
                : secondsRemaining < 900
                ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                : 'bg-slate-950 border-slate-700 text-emerald-400'
            }`}>
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="min-h-[38px] px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main CBT Workspace Layout (Question Area + Question Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ============================================================ */}
        {/* LEFT / CENTER: QUESTION DISPLAY & INTERACTIVE RESPONSE       */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
            
            {/* Question Top Subheader */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded-md text-xs font-mono shrink-0">
                  Q {currentIdx + 1} / {totalQuestions}
                </span>
                <span className="text-slate-600 font-medium truncate max-w-[200px] sm:max-w-md">
                  Ch {currentQ.chapterNumber}: {currentQ.chapterName}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
                <span className="text-slate-500 font-mono">
                  +1.00 / 0.00
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-medium text-[10px]">
                  {currentQ.sourceLabel}
                </span>
              </div>
            </div>

            {/* Question Body */}
            <div className="p-4 sm:p-6 flex-1 space-y-4 sm:space-y-6">
              {/* Question Text in English */}
              <div className="space-y-2">
                <p className="text-sm sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  <span className="text-blue-600 font-mono font-bold mr-1.5">Q{currentIdx + 1}.</span>
                  {currentQ.questionEn}
                </p>
                {/* Hindi translation */}
                {showHindi && currentQ.questionHi && (
                  <p className="text-xs sm:text-base text-slate-700 font-hindi leading-relaxed bg-amber-50/50 p-2.5 sm:p-3 rounded-xl border border-amber-200/60">
                    {currentQ.questionHi}
                  </p>
                )}
              </div>

              {/* Options Grid */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select your answer:
                </div>
                <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                  {currentQ.optionsEn.map((optEn, optIdx) => {
                    const optHi = currentQ.optionsHi ? currentQ.optionsHi[optIdx] : null;
                    const isSelected = userAnswers[currentIdx] === optIdx;

                    return (
                      <button
                        type="button"
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`text-left p-3 sm:p-4 rounded-xl border transition-all flex items-start gap-2.5 sm:gap-3 cursor-pointer group select-none touch-manipulation active:scale-[0.99] ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-1 ring-blue-500/50'
                            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Radio icon */}
                        <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                        }`}>
                          {optionLetters[optIdx]}
                        </span>

                        {/* Option Text */}
                        <div className="flex-1 space-y-0.5 min-w-0">
                          <span className={`text-xs sm:text-sm leading-snug block break-words ${isSelected ? 'font-bold text-blue-950' : 'text-slate-800'}`}>
                            {optEn}
                          </span>
                          {showHindi && optHi && optHi !== optEn && (
                            <span className="text-[11px] sm:text-xs text-slate-600 font-hindi block break-words">
                              {optHi}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions for current question */}
            <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={userAnswers[currentIdx] === undefined}
                  className={`flex-1 sm:flex-none min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    userAnswers[currentIdx] !== undefined
                      ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer'
                      : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleMarkReview}
                  className={`flex-1 sm:flex-none min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    markedForReview.has(currentIdx)
                      ? 'bg-purple-100 border-purple-400 text-purple-800'
                      : 'bg-white hover:bg-purple-50 border-purple-200 text-purple-700'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{markedForReview.has(currentIdx) ? 'Unmark' : 'Review'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Dedicated Previous Question Option */}
                <button
                  type="button"
                  id="cbt-prev-btn"
                  disabled={currentIdx === 0}
                  onClick={handlePrevious}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    currentIdx === 0
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 cursor-pointer shadow-xs active:scale-95'
                  }`}
                  title="Previous Question"
                  aria-label="Previous Question"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {/* Dedicated Next Question Option */}
                <button
                  type="button"
                  id="cbt-next-btn"
                  disabled={currentIdx === totalQuestions - 1}
                  onClick={handleNext}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    currentIdx === totalQuestions - 1
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 cursor-pointer shadow-xs active:scale-95'
                  }`}
                  title="Next Question"
                  aria-label="Next Question"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Mark for Review & Next */}
                <button
                  type="button"
                  id="cbt-mark-next-btn"
                  onClick={handleMarkReviewAndNext}
                  className="min-h-[42px] px-3.5 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  title="Mark for Review and Move to Next"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Mark &amp; Next</span>
                </button>

                {/* Save & Next / Save */}
                <button
                  type="button"
                  id="cbt-save-next-btn"
                  onClick={handleSaveAndNext}
                  className="min-h-[42px] px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  title="Save Answer and Move to Next"
                >
                  <span>{currentIdx === totalQuestions - 1 ? 'Save' : 'Save & Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: QUESTION PALETTE & TEST PROGRESS SUMMARY              */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Question Palette Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Question Palette
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {answeredCount} / {totalQuestions} Answered
              </span>
            </div>

            {/* Legend Stats */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">
                  {answeredCount}
                </span>
                <span className="text-slate-700">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-red-500 text-white font-bold flex items-center justify-center text-[10px]">
                  {notAnsweredCount}
                </span>
                <span className="text-slate-700">Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {reviewCount}
                </span>
                <span className="text-slate-700">Marked Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                  {notVisitedCount}
                </span>
                <span className="text-slate-700">Not Visited</span>
              </div>
            </div>

            {/* Questions Grid (1 to N) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Choose Question to Jump:
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-[300px] overflow-y-auto overscroll-contain p-1 border border-slate-100 rounded-lg">
                {test.questions.map((_, i) => {
                  const status = getQuestionStatus(i);
                  const isCurrent = i === currentIdx;

                  let bgClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                  if (status === 'answered') {
                    bgClass = 'bg-emerald-600 text-white hover:bg-emerald-700';
                  } else if (status === 'answered_review') {
                    bgClass = 'bg-purple-700 text-white ring-2 ring-emerald-400';
                  } else if (status === 'review') {
                    bgClass = 'bg-purple-600 text-white hover:bg-purple-700';
                  } else if (status === 'not_answered') {
                    bgClass = 'bg-red-500 text-white hover:bg-red-600';
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIdx(i)}
                      className={`h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative ${bgClass} ${
                        isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 z-10 font-extrabold' : ''
                      }`}
                    >
                      {i + 1}
                      {status === 'answered_review' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Submit Button in Palette */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Final Examination</span>
              </button>
            </div>

          </div>

          {/* Test Guidelines Tip Box */}
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              NIELIT CBT Instructions
            </h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800/90 text-[11px] leading-relaxed">
              <li>Each question carries 1.00 mark with no negative marking.</li>
              <li>You can modify your answer any time before final submission.</li>
              <li>Marked for review questions will still be evaluated if answered.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* MOBILE QUESTION PALETTE DRAWER/MODAL                         */}
      {/* ============================================================ */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 lg:hidden">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-3 animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Question Palette</h3>
                <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  {answeredCount}/{totalQuestions} Answered
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobilePaletteOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">
                  {answeredCount}
                </span>
                <span className="text-slate-700">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-red-500 text-white font-bold flex items-center justify-center text-[10px]">
                  {notAnsweredCount}
                </span>
                <span className="text-slate-700">Unanswered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {reviewCount}
                </span>
                <span className="text-slate-700">Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                  {notVisitedCount}
                </span>
                <span className="text-slate-700">Not Visited</span>
              </div>
            </div>

            {/* Question Buttons Grid */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-2 safe-area-pb">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-1">
                {test.questions.map((_, i) => {
                  const status = getQuestionStatus(i);
                  const isCurrent = i === currentIdx;

                  let bgClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (status === 'answered') {
                    bgClass = 'bg-emerald-600 text-white';
                  } else if (status === 'answered_review') {
                    bgClass = 'bg-purple-700 text-white ring-2 ring-emerald-400';
                  } else if (status === 'review') {
                    bgClass = 'bg-purple-600 text-white';
                  } else if (status === 'not_answered') {
                    bgClass = 'bg-red-500 text-white';
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setCurrentIdx(i);
                        setMobilePaletteOpen(false);
                      }}
                      className={`h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative ${bgClass} ${
                        isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 z-10 font-black' : ''
                      }`}
                    >
                      {i + 1}
                      {status === 'answered_review' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions inside modal */}
            <div className="pt-2 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => setMobilePaletteOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close Palette
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobilePaletteOpen(false);
                  setShowSubmitModal(true);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Submit Examination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBMISSION CONFIRMATION MODAL                                */}
      {/* ============================================================ */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Examination Submission
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to submit your test paper?
              </p>
            </div>

            {/* Summary Table */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Total Questions:</span>
                <strong className="text-slate-900 font-mono">{totalQuestions}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Questions Answered:</span>
                <strong className="text-emerald-600 font-mono">{answeredCount}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Unanswered Questions:</span>
                <strong className="text-red-600 font-mono">{notAnsweredCount}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Marked for Review:</span>
                <strong className="text-purple-600 font-mono">{reviewCount}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Time Spent:</span>
                <strong className="text-slate-900 font-mono">{formatTime(timeSpentSeconds)}</strong>
              </div>
            </div>

            <p className="text-[11px] text-blue-800 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
              Note: After submission, your detailed scorecard, answers evaluation, and chapter-wise analysis will be displayed.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Return to Test
              </button>
              <button
                type="button"
                onClick={handleForceSubmit}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Yes, Submit Final
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile-First Sticky Bottom Action Bar: Guarantees Previous & Next Question options are always accessible on mobile */}
      <div 
        id="cbt-mobile-sticky-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2 safe-area-pb"
      >
        {/* Previous Question Option */}
        <button
          id="cbt-mobile-prev-btn"
          type="button"
          disabled={currentIdx === 0}
          onClick={handlePrevious}
          className="flex-1 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-100 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer shadow-sm"
          aria-label="Previous Question"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Previous</span>
        </button>

        {/* Mobile Review Toggle Button */}
        <button
          id="cbt-mobile-review-btn"
          type="button"
          onClick={handleToggleMarkReview}
          className={`py-1 px-2.5 rounded-xl border text-center min-h-[44px] flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 ${
            markedForReview.has(currentIdx)
              ? 'bg-purple-900/80 border-purple-500 text-purple-200'
              : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:text-slate-200'
          }`}
          title="Mark Question for Review"
          aria-label="Mark Question for Review"
        >
          <Bookmark className={`w-3.5 h-3.5 ${markedForReview.has(currentIdx) ? 'text-purple-300 fill-purple-300' : 'text-slate-400'}`} />
          <span className="text-[9px] font-sans mt-0.5 leading-none">Review</span>
        </button>

        {/* Quick Palette / Question Count Button */}
        <button
          id="cbt-mobile-palette-btn"
          type="button"
          onClick={() => setMobilePaletteOpen(true)}
          className="py-1 px-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-center min-h-[44px] flex flex-col items-center justify-center cursor-pointer hover:border-slate-600 transition-colors shrink-0"
          title="Open Question Palette"
          aria-label="Open Question Palette"
        >
          <span className="font-mono text-xs font-bold text-cyan-300 leading-none">
            {currentIdx + 1}/{totalQuestions}
          </span>
          <span className="text-[9px] text-slate-400 font-sans mt-0.5 leading-none">
            Palette
          </span>
        </button>

        {/* Next Question Option */}
        <button
          id="cbt-mobile-next-btn"
          type="button"
          disabled={currentIdx === totalQuestions - 1}
          onClick={handleNext}
          className="flex-1 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-100 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer shadow-sm"
          aria-label="Next Question"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
        </button>

        {/* Save & Next Option */}
        <button
          id="cbt-mobile-save-next-btn"
          type="button"
          onClick={handleSaveAndNext}
          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-1 transition-all min-h-[44px] cursor-pointer shrink-0"
          title="Save Response and Move to Next"
          aria-label="Save Response and Move to Next"
        >
          <CheckSquare className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">{currentIdx === totalQuestions - 1 ? 'Save' : 'Save & Next'}</span>
        </button>
      </div>

    </div>
  );
};
