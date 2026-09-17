import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Columns, 
  RotateCcw, 
  FileCheck2,
  HelpCircle, 
  CheckCircle,
  Sparkles,
  Send,
  Clock,
  AlertTriangle,
  X,
  Monitor
} from 'lucide-react';
import { GeneratedTest } from '../types';
import { generateSampleUserAnswers } from '../data/testGenerator';
import { TestResultGateway } from './TestResultGateway';

interface PrintableTestPaperProps {
  test: GeneratedTest;
  onReconfigure: () => void;
  onSwitchToCBT?: () => void;
}

export const PrintableTestPaper: React.FC<PrintableTestPaperProps> = ({
  test,
  onReconfigure,
  onSwitchToCBT
}) => {
  const [twoColumnLayout, setTwoColumnLayout] = useState(true);
  const [showHindi, setShowHindi] = useState(true);
  const [showAnswers, setShowAnswers] = useState(test.config.includeAnswerKey);
  const [showExplanations, setShowExplanations] = useState(test.config.includeExplanations);
  const [showOMR, setShowOMR] = useState(test.config.includeOMRSheet);

  // Interactive Test State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Timer effect while unsubmitted
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeSpentSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handlePrint = () => {
    window.print();
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => {
      if (prev[questionIndex] === optionIndex) {
        const next = { ...prev };
        delete next[questionIndex];
        return next;
      }
      return { ...prev, [questionIndex]: optionIndex };
    });
  };

  const handleAutoFillAnswers = () => {
    const sample = generateSampleUserAnswers(test, 74);
    setUserAnswers(sample);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    k => userAnswers[Number(k)] !== undefined && userAnswers[Number(k)] !== -1
  ).length;
  const totalQuestions = test.questions.length;
  const unattemptedCount = totalQuestions - answeredCount;

  const optionLetters = ['(A)', '(B)', '(C)', '(D)'];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // If submitted, display the Result Gateway (Locked -> Enter Roll No & Name -> Result Marksheet)
  if (isSubmitted) {
    return (
      <TestResultGateway
        test={test}
        userAnswers={userAnswers}
        timeSpentSeconds={timeSpentSeconds}
        onBackToPaper={() => setIsSubmitted(false)}
        onConfigureNew={onReconfigure}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 sticky top-20 z-30 gpu-layer">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="print-paper-btn"
              onClick={handlePrint}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onReconfigure}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Reconfigure</span>
            </button>

            {onSwitchToCBT && (
              <button
                type="button"
                onClick={onSwitchToCBT}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                title="Launch Interactive Computer Based Test (CBT) Simulator"
              >
                <Monitor className="w-4 h-4 text-emerald-600" />
                <span>Launch CBT</span>
              </button>
            )}
          </div>

          {/* Test Submission CTA */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{formatTimer(timeSpentSeconds)}</span>
              <span className="text-slate-300">|</span>
              <span className="text-blue-700 whitespace-nowrap">{answeredCount}/{totalQuestions} Answered</span>
            </div>

            <button
              type="button"
              onClick={handleAutoFillAnswers}
              className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer min-h-[38px]"
              title="Autofill sample responses to quickly test submission & result verification"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autofill</span>
            </button>

            <button
              id="btn-submit-test"
              onClick={() => setShowSubmitModal(true)}
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test Paper</span>
            </button>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTwoColumnLayout(!twoColumnLayout)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                twoColumnLayout ? 'bg-slate-100 border-slate-300 font-bold' : 'bg-white border-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              {twoColumnLayout ? '2 Columns (Exam Paper)' : '1 Column (Standard)'}
            </button>

            <button
              onClick={() => setShowHindi(!showHindi)}
              className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showHindi ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold' : 'bg-white border-slate-200'
              }`}
            >
              Bilingual (Hindi + English)
            </button>

            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showAnswers ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-white border-slate-200'
              }`}
            >
              Answer Key
            </button>

            <button
              onClick={() => setShowOMR(!showOMR)}
              className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showOMR ? 'bg-purple-50 border-purple-300 text-purple-800 font-bold' : 'bg-white border-slate-200'
              }`}
            >
              OMR Sheet
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-sans">
            Click on any option (A/B/C/D) to mark your response before submitting
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SUBMISSION CONFIRMATION MODAL                                */}
      {/* ============================================================ */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Submit Examination
                </h3>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">
                Are you sure you want to submit your <strong className="text-slate-900">{test.moduleCode}</strong> examination?
              </p>

              <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="p-2">
                  <span className="text-[10px] text-slate-400 font-semibold block">Total</span>
                  <strong className="text-sm font-mono text-slate-900">{totalQuestions}</strong>
                </div>
                <div className="p-2 border-x border-slate-200">
                  <span className="text-[10px] text-emerald-600 font-semibold block">Answered</span>
                  <strong className="text-sm font-mono text-emerald-700">{answeredCount}</strong>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-amber-600 font-semibold block">Unattempted</span>
                  <strong className="text-sm font-mono text-amber-700">{unattemptedCount}</strong>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Result Protection Notice:</strong> Your result will not be displayed immediately after submission. You will need to enter your registered Candidate Name and Roll Number on the verification screen to view your Statement of Marks.
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Continue Answering
              </button>

              <button
                type="button"
                id="btn-confirm-submit"
                onClick={handleConfirmSubmit}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Confirm & Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* OFFICIAL QUESTION BOOKLET CONTAINER                          */}
      {/* ============================================================ */}
      <div className="print-area bg-white text-slate-900 shadow-lg sm:rounded-2xl border border-slate-300 p-6 sm:p-10 font-serif leading-normal">
        
        {/* NIELIT Official Header */}
        <div className="border-b-4 border-slate-900 pb-4 mb-6 text-center space-y-1">
          <div className="flex items-center justify-between text-xs font-sans font-bold text-slate-600 border-b border-slate-200 pb-1 mb-2">
            <span>Booklet Code: <strong className="text-slate-900 font-mono font-bold text-sm">O-LVL-{test.config.bookletSeries}-{test.config.moduleId}</strong></span>
            <span>NIELIT 'O' Level Examination (R5.1)</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-mono text-sm font-bold">
              SERIES: {test.config.bookletSeries}
            </span>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-600 font-sans font-bold">
            राष्ट्रीय इलेक्ट्रॉनिकी एवं सूचना प्रौद्योगिकी संस्थान (रा.इ.सू.प्रौ.सं.)
          </p>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
            National Institute of Electronics and Information Technology
          </h1>
          <p className="text-xs text-slate-600 font-sans">
            (An Autonomous Scientific Society of Ministry of Electronics and Information Technology, Govt. of India)
          </p>
          
          <div className="py-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase">
              EXAMINATION FOR 'O' LEVEL COURSE — REVISION 5.1
            </h2>
            <p className="text-sm font-bold text-slate-800">
              MODULE: {test.moduleCode} — {test.moduleTitle}
            </p>
            {test.config.testType === 'chapter_wise' && (
              <p className="text-xs font-sans font-semibold text-blue-800 mt-0.5">
                Chapter-Wise Targeted Test: Chapters {test.config.selectedChapters.join(', ')}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs font-sans font-bold text-slate-800 border-t border-slate-300">
            <div>
              TIME ALLOWED: <span className="underline">{test.config.durationMinutes} MINUTES ({test.config.durationMinutes === 90 ? '1.5 HOURS' : '45 MINUTES'})</span>
            </div>
            <div>
              MAXIMUM MARKS: <span className="underline">{test.config.questionCount}</span>
            </div>
            <div>
              TOTAL QUESTIONS: <span className="underline">{test.config.questionCount} MCQs</span>
            </div>
          </div>
        </div>

        {/* Candidate Information Box */}
        <div className="border-2 border-slate-800 p-3.5 mb-6 text-xs font-sans space-y-2.5 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="font-bold text-slate-700 block mb-1">
                ROLL NUMBER / अनुक्रमांक:
              </span>
              <div className="flex gap-1">
                {(test.config.rollNumber || '240182749').padEnd(10, ' ').slice(0, 10).split('').map((digit, i) => (
                  <div 
                    key={i} 
                    className="w-7 h-8 border border-slate-700 bg-white flex items-center justify-center font-mono font-bold text-sm text-slate-900"
                  >
                    {digit !== ' ' ? digit : ''}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1">
                CANDIDATE'S NAME / अभ्यर्थी का नाम:
              </span>
              <div className="border-b-2 border-dotted border-slate-600 h-8 flex items-end font-semibold text-slate-900 px-2 uppercase">
                {test.config.candidateName || 'Rahul Sharma'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 border-t border-slate-300 text-[11px] text-slate-600">
            <div>
              <span className="font-bold text-slate-800">Exam Center Code:</span> _________________
            </div>
            <div>
              <span className="font-bold text-slate-800">Candidate's Signature:</span> _________________
            </div>
            <div>
              <span className="font-bold text-slate-800">Invigilator's Signature:</span> _________________
            </div>
          </div>
        </div>

        {/* Official Instructions to Candidates */}
        <div className="border border-slate-300 p-3 mb-6 bg-slate-50 text-[11px] font-sans text-slate-700 space-y-1">
          <h3 className="font-bold text-slate-900 uppercase text-xs mb-1">
            IMPORTANT INSTRUCTIONS FOR CANDIDATES / परीक्षार्थियों के लिए महत्वपूर्ण निर्देश:
          </h3>
          <ol className="list-decimal list-inside space-y-0.5 leading-relaxed">
            <li>
              This question booklet contains <strong>{test.config.questionCount} Objective Type Multiple Choice Questions</strong> carrying 1 mark each.
              (इस प्रश्न पुस्तिका में {test.config.questionCount} वस्तुनिष्ठ बहुविकल्पीय प्रश्न हैं, प्रत्येक का 1 अंक है।)
            </li>
            <li>
              There is <strong>NO NEGATIVE MARKING</strong> for wrong answers. All questions are compulsory.
              (गलत उत्तरों के लिए कोई नकारात्मक अंकन नहीं है। सभी प्रश्न अनिवार्य हैं।)
            </li>
            <li>
              Darken or click only ONE option for each question.
              (प्रत्येक प्रश्न के लिए केवल एक विकल्प का चयन करें।)
            </li>
            <li>
              In case of any discrepancy in Hindi and English versions, the English version shall be treated as final.
              (हिंदी और अंग्रेजी संस्करण में किसी भी विसंगति के मामले में अंग्रेजी संस्करण को अंतिम माना जाएगा।)
            </li>
          </ol>
        </div>

        {/* ============================================================ */}
        {/* QUESTIONS GRID (2-COLUMN OR 1-COLUMN)                        */}
        {/* ============================================================ */}
        <div className={twoColumnLayout ? 'columns-1 md:columns-2 gap-8 divide-x-0' : 'space-y-6'}>
          {test.questions.map((q, idx) => {
            const selectedOption = userAnswers[idx];

            return (
              <div 
                key={q.id}
                className="break-inside-avoid mb-6 pb-4 border-b border-slate-200 text-xs font-sans space-y-1.5"
              >
                {/* Question Number & Header */}
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>Q.{idx + 1}.</span>
                    {selectedOption !== undefined && selectedOption !== -1 && (
                      <span className="no-print text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                        Option {['A', 'B', 'C', 'D'][selectedOption]}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    [Ch.{q.chapterNumber} • {q.sourceLabel}]
                  </span>
                </div>

                {/* Question Text (English) */}
                <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug">
                  {q.questionEn}
                </p>

                {/* Question Text (Hindi) */}
                {showHindi && q.questionHi && (
                  <p className="text-slate-700 text-xs font-hindi leading-snug">
                    {q.questionHi}
                  </p>
                )}

                {/* Options A, B, C, D */}
                <div className="grid grid-cols-1 gap-1.5 pt-1 pl-1">
                  {q.optionsEn.map((optEn, optIdx) => {
                    const optHi = q.optionsHi ? q.optionsHi[optIdx] : null;
                    const isSelected = selectedOption === optIdx;

                    return (
                      <button
                        type="button"
                        key={optIdx}
                        onClick={() => handleOptionSelect(idx, optIdx)}
                        className={`text-left p-1.5 rounded-lg border transition-all flex items-start gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className={`font-bold w-6 shrink-0 text-xs text-center rounded py-0.5 ${
                          isSelected ? 'bg-blue-600 text-white' : 'text-slate-700 bg-slate-100'
                        }`}>
                          {optionLetters[optIdx]}
                        </span>
                        <div className="flex-1 text-xs text-slate-800">
                          <span className={isSelected ? 'font-bold text-blue-950' : ''}>{optEn}</span>
                          {showHindi && optHi && optHi !== optEn && (
                            <span className="block text-slate-600 font-hindi text-[11px]">
                              {optHi}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Submit */}
        <div className="no-print my-8 p-6 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base">Finished answering questions?</h4>
            <p className="text-slate-300 text-xs">
              You have answered <strong className="text-white">{answeredCount} of {totalQuestions}</strong> questions.
            </p>
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
            Submit Examination
          </button>
        </div>

        {/* ============================================================ */}
        {/* ANSWER KEY SECTION                                           */}
        {/* ============================================================ */}
        {showAnswers && (
          <div className="mt-10 pt-6 border-t-2 border-slate-900 break-before-page">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold uppercase font-sans text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                Official Answer Key — Booklet Series '{test.config.bookletSeries}'
              </h3>
              <span className="text-xs font-sans text-slate-500">
                {test.moduleCode} • {test.questions.length} Questions
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center font-mono text-xs border border-slate-300 p-2 bg-slate-50">
              {test.questions.map((q, i) => (
                <div key={q.id} className="p-1 border border-slate-200 bg-white rounded">
                  <span className="text-[10px] text-slate-400 block font-sans">Q{i + 1}</span>
                  <strong className="text-emerald-700 text-sm">
                    {['A', 'B', 'C', 'D'][q.correctIndex]}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* DETAILED EXPLANATIONS & SOLUTIONS                            */}
        {/* ============================================================ */}
        {showExplanations && (
          <div className="mt-8 pt-6 border-t border-slate-300 space-y-4 font-sans text-xs break-before-page">
            <h3 className="text-base font-bold uppercase text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Detailed Solutions & Explanations / विस्तृत हल
            </h3>

            <div className="space-y-3">
              {test.questions.map((q, i) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>
                      Question {i + 1}: Correct Answer is <span className="text-emerald-700 font-mono">({['A', 'B', 'C', 'D'][q.correctIndex]}) {q.optionsEn[q.correctIndex]}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Chapter: {q.chapterName}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {q.explanationEn}
                  </p>
                  {q.explanationHi && showHindi && (
                    <p className="text-slate-600 text-xs font-hindi leading-relaxed">
                      {q.explanationHi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PRINTABLE OMR ANSWER SHEET TEMPLATE                          */}
        {/* ============================================================ */}
        {showOMR && (
          <div className="mt-10 pt-6 border-t-2 border-dashed border-slate-400 break-before-page">
            <div className="border-4 border-slate-900 p-6 rounded-lg bg-white space-y-4">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h4 className="font-bold text-sm uppercase text-slate-900 tracking-wider">
                  NIELIT O LEVEL EXAMINATION — OMR ANSWER SHEET
                </h4>
                <p className="text-[11px] text-slate-600">
                  Use Black or Blue Ballpoint Pen Only • Darken Complete Circles Like ●
                </p>
              </div>

              {/* OMR Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border border-slate-300 p-3 bg-slate-50">
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Candidate Name:</span>
                  <div className="border-b border-slate-500 h-6 font-semibold uppercase">
                    {test.config.candidateName || 'RAHUL SHARMA'}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Roll Number:</span>
                  <div className="border-b border-slate-500 h-6 font-mono font-bold">
                    {test.config.rollNumber || '240182749'}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-0.5">Booklet Series:</span>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map((s) => (
                      <div key={s} className="flex items-center gap-1 font-bold text-xs">
                        <span className={`w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center ${
                          test.config.bookletSeries === s ? 'bg-slate-900 text-white' : 'bg-white'
                        }`}>
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* OMR Bubble Grid */}
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 text-xs">
                  {Array.from({ length: Math.ceil(test.questions.length / 20) }).map((_, colIdx) => (
                    <div key={colIdx} className="border border-slate-300 rounded p-2 bg-slate-50/50 space-y-1">
                      {test.questions.slice(colIdx * 20, (colIdx + 1) * 20).map((_, rowIdx) => {
                        const qNum = colIdx * 20 + rowIdx + 1;
                        const selectedForThis = userAnswers[qNum - 1];

                        return (
                          <div key={qNum} className="flex items-center justify-between text-[11px] font-mono">
                            <span className="w-6 text-slate-600 text-right pr-1 font-sans">{qNum}.</span>
                            <div className="flex items-center gap-1">
                              {['A', 'B', 'C', 'D'].map((opt, optIdx) => {
                                const isMarked = selectedForThis === optIdx;
                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    onClick={() => handleOptionSelect(qNum - 1, optIdx)}
                                    className={`w-4 h-4 rounded-full border text-[9px] flex items-center justify-center cursor-pointer ${
                                      isMarked 
                                        ? 'bg-slate-950 text-white border-slate-950 font-bold' 
                                        : 'border-slate-500 text-slate-600 bg-white hover:bg-slate-100'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* OMR Footer Signatures */}
              <div className="pt-4 border-t border-slate-300 flex justify-between text-[10px] text-slate-500 font-sans">
                <div>Candidate's Signature: _______________________</div>
                <div>Invigilator's Signature: _______________________</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

