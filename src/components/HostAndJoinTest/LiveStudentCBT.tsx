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
  Sparkles,
  LayoutGrid,
  Radio,
  CheckCircle2,
  XCircle,
  BarChart3,
  Megaphone,
  ShieldAlert,
  Lock,
  ShieldCheck,
  EyeOff,
  Eye,
  X
} from 'lucide-react';
import { Question, LiveTestStudent } from '../../types';
import { soundFx } from '../../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface LiveStudentCBTProps {
  testId: string;
  student: LiveTestStudent;
  questions: Question[];
  durationMinutes: number;
  startedAt?: string;
  testTitle: string;
  hostName: string;
  showImmediateResults?: boolean;
  negativeMarking?: number;
  onLeave: () => void;
}

export const LiveStudentCBT: React.FC<LiveStudentCBTProps> = ({
  testId,
  student,
  questions,
  durationMinutes,
  startedAt,
  testTitle,
  hostName,
  showImmediateResults = true,
  negativeMarking = 0,
  onLeave
}) => {
  const totalQuestions = questions.length;
  const initialDurationSeconds = (durationMinutes || 90) * 60;

  // Calculate remaining seconds based on server startedAt
  const calculateRemainingSeconds = () => {
    if (!startedAt) return initialDurationSeconds;
    const startTime = new Date(startedAt).getTime();
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
    return Math.max(0, initialDurationSeconds - elapsedSeconds);
  };

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(calculateRemainingSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showHindi, setShowHindi] = useState<boolean>(true);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedAtTime, setSubmittedAtTime] = useState<string>('');
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState<boolean>(false);

  // Live Results Visibility state (initially from prop, reactive to live host release)
  const [showImmediateResultsState, setShowImmediateResultsState] = useState<boolean>(showImmediateResults);
  const [sessionStatus, setSessionStatus] = useState<string>('in_progress');

  // Live Proctoring & Broadcast State
  const [tabSwitchesCount, setTabSwitchesCount] = useState<number>(student.tabSwitchesCount || 0);
  const [showProctorWarningModal, setShowProctorWarningModal] = useState<boolean>(false);
  const [autoSubmittedReason, setAutoSubmittedReason] = useState<string | null>(null);
  const [hostBroadcastMsg, setHostBroadcastMsg] = useState<string | null>(null);
  const [hostBroadcastTime, setHostBroadcastTime] = useState<string | null>(null);

  // Refs for real-time event listeners avoiding stale closures
  const userAnswersRef = useRef<Record<number, number>>(userAnswers);
  userAnswersRef.current = userAnswers;
  const isSubmittedRef = useRef<boolean>(isSubmitted);
  isSubmittedRef.current = isSubmitted;
  const tabSwitchesRef = useRef<number>(student.tabSwitchesCount || 0);
  const isAutoSubmittingRef = useRef<boolean>(false);
  const lastInfractionTimeRef = useRef<number>(0);

  // Auto submit trigger when proctoring violation occurs (2nd tab switch or app change)
  const triggerAutoSubmit = async (reason: string, finalCount: number) => {
    if (isAutoSubmittingRef.current || isSubmittedRef.current) return;
    isAutoSubmittingRef.current = true;
    setIsSubmitting(true);
    soundFx.playWarning();

    let correct = 0;
    let incorrect = 0;
    const currentAnswers = userAnswersRef.current;

    questions.forEach((q, idx) => {
      const userAns = currentAnswers[idx];
      const correctAns = typeof q.correctIndex === 'number' ? q.correctIndex : q.correctAnswer;
      if (userAns !== undefined) {
        if (userAns === correctAns) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const penaltyRate = typeof negativeMarking === 'number' ? negativeMarking : 0;
    const rawScore = correct - (incorrect * penaltyRate);
    const score = Math.max(0, Math.round(rawScore * 100) / 100);
    const maxScore = totalQuestions;
    const percentage = Math.max(0, Math.min(100, Math.round((score / (maxScore || 1)) * 100)));
    const grade = calculateGrade(percentage);
    const nowTimeStr = new Date().toLocaleTimeString();

    // 1. Notify server of auto-submission due to proctoring infraction
    try {
      await fetch(`/api/live-tests/${testId}/proctor-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          eventType: 'tab_switch_auto_submit',
          isAutoSubmitted: true,
          tabSwitchesCount: finalCount,
          score,
          maxScore,
          percentage,
          userAnswers: currentAnswers
        })
      });
    } catch (err) {
      console.warn('Proctor auto-submit notification error:', err);
    }

    // 2. Transmit final score and answers
    try {
      await fetch(`/api/live-tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          score,
          maxScore,
          percentage,
          userAnswers: currentAnswers
        })
      });
    } catch (err) {
      console.warn('Standard test submission error:', err);
    }

    setResultData({
      score,
      maxScore,
      percentage,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: totalQuestions - (correct + incorrect),
      grade
    });

    setAutoSubmittedReason(reason);
    setSubmittedAtTime(nowTimeStr);
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setShowSubmitModal(false);
    setShowProctorWarningModal(false);
    setIsSubmitting(false);
  };

  // 2-Strike Anti-Cheat Infraction Dispatcher
  // RULE: DO NOT auto submit test; ONLY show warning to student and host both.
  const handleProctorInfraction = (eventType: 'tab_switch' | 'browser_closed') => {
    if (isSubmittedRef.current || isAutoSubmittingRef.current) return;

    // Cooldown debounce (2.5 seconds): Prevents browser event cascades from registering duplicate strikes
    const now = Date.now();
    if (now - lastInfractionTimeRef.current < 2500) {
      return;
    }
    lastInfractionTimeRef.current = now;

    tabSwitchesRef.current += 1;
    const currentCount = tabSwitchesRef.current;
    setTabSwitchesCount(currentCount);

    // Show warning modal to student and trigger audio warning
    setShowProctorWarningModal(true);
    soundFx.playWarning();

    const proctorEventType = currentCount === 1 
      ? 'tab_switch_warning' 
      : currentCount === 2 
      ? 'tab_switch_warning_2' 
      : 'tab_switch_warning_repeat';

    // Notify Host Control Room in real-time (Warning-only: isAutoSubmitted is always false)
    fetch(`/api/live-tests/${testId}/proctor-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        eventType: proctorEventType,
        tabSwitchesCount: currentCount,
        isAutoSubmitted: false,
        userAnswers: userAnswersRef.current
      })
    }).catch((err) => console.warn('Proctoring log error:', err));
  };

  // Track tab switching proctoring using official Page Visibility API (2-Strike Warning System)
  useEffect(() => {
    if (isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleProctorInfraction('tab_switch');
      }
    };

    const handlePageHide = () => {
      if (isSubmittedRef.current) return;
      const count = tabSwitchesRef.current + 1;
      const payload = JSON.stringify({
        studentId: student.id,
        eventType: 'browser_closed',
        isAutoSubmitted: false,
        tabSwitchesCount: count,
        userAnswers: userAnswersRef.current
      });
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(`/api/live-tests/${testId}/proctor-event`, blob);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [testId, student.id, isSubmitted]);

  // Poll for host broadcasts, session status & result visibility release (every 3.5 seconds)
  useEffect(() => {
    let isMounted = true;

    const pollHostStatus = async () => {
      try {
        const res = await fetch(`/api/live-tests/${testId}/session`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data.success || !data.session) return;

        if (data.session.broadcastMessage) {
          setHostBroadcastMsg(data.session.broadcastMessage);
          setHostBroadcastTime(data.session.broadcastTime || null);
        } else {
          setHostBroadcastMsg(null);
        }

        if (typeof data.session.showImmediateResults === 'boolean') {
          setShowImmediateResultsState((prev) => {
            if (!prev && data.session.showImmediateResults) {
              soundFx.playSuccess();
            }
            return data.session.showImmediateResults;
          });
        }

        if (data.session.status) {
          setSessionStatus(data.session.status);
        }

        // If host forcefully ended session while student is still writing test, auto submit
        if (data.session.status === 'ended' && !isSubmitted) {
          handleForceSubmit();
        }
      } catch (e) {
        // silent
      }
    };

    pollHostStatus();
    const interval = setInterval(pollHostStatus, 3500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [testId, isSubmitted]);

  // Result state
  const [resultData, setResultData] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    grade: string;
  } | null>(null);

  // Mark current as visited on navigation
  useEffect(() => {
    setVisitedQuestions((prev) => {
      const next = new Set(prev);
      next.add(currentIdx);
      return next;
    });
  }, [currentIdx]);

  // Real-time Countdown timer effect
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

  // Periodically sync answers to server (every 5 seconds)
  useEffect(() => {
    if (isSubmitted) return;

    const syncInterval = setInterval(async () => {
      const answersCount = Object.keys(userAnswers).length;
      try {
        await fetch(`/api/live-tests/${testId}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: student.id,
            answersCount,
            userAnswers
          })
        });
      } catch (err) {
        console.warn('Silent progress sync error:', err);
      }
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [testId, student.id, userAnswers, isSubmitted]);

  // Format time display
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    soundFx.playClick(720, 0.04);
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const handleClearResponse = () => {
    soundFx.playClick(400, 0.04);
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  const handleToggleReview = () => {
    soundFx.playClick(600, 0.05);
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

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      soundFx.playClick(800, 0.03);
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      soundFx.playClick(600, 0.03);
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const reviewCount = markedForReview.size;
  const unattemptedCount = totalQuestions - answeredCount;

  // Grade calculation
  const calculateGrade = (pct: number): string => {
    if (pct >= 85) return 'S (Outstanding)';
    if (pct >= 75) return 'A (Excellent)';
    if (pct >= 65) return 'B (Very Good)';
    if (pct >= 55) return 'C (Fair)';
    if (pct >= 50) return 'D (Satisfactory)';
    return 'F (Fail)';
  };

  // Submit test
  const submitExam = async () => {
    setIsSubmitting(true);
    let correct = 0;
    let incorrect = 0;

    questions.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      const correctAns = typeof q.correctIndex === 'number' ? q.correctIndex : q.correctAnswer;
      if (userAns !== undefined) {
        if (userAns === correctAns) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const penaltyRate = typeof negativeMarking === 'number' ? negativeMarking : 0;
    const rawScore = correct - (incorrect * penaltyRate);
    const score = Math.max(0, Math.round(rawScore * 100) / 100);
    const maxScore = totalQuestions;
    const percentage = Math.max(0, Math.min(100, Math.round((score / (maxScore || 1)) * 100)));
    const grade = calculateGrade(percentage);
    const nowTimeStr = new Date().toLocaleTimeString();

    try {
      await fetch(`/api/live-tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          score,
          maxScore,
          percentage,
          userAnswers
        })
      });
    } catch (err) {
      console.warn('Live test submission error:', err);
    }

    setResultData({
      score,
      maxScore,
      percentage,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: totalQuestions - (correct + incorrect),
      grade
    });

    setSubmittedAtTime(nowTimeStr);
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setShowSubmitModal(false);
    setIsSubmitting(false);
    soundFx.playSuccess();
  };

  const handleForceSubmit = () => {
    soundFx.playWarning();
    submitExam();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Examination Header */}
      <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {testTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live CBT
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">
              Candidate: <span className="text-cyan-300 font-semibold">{student.studentName}</span> (Roll: <span className="font-mono text-slate-300">{student.rollNumber}</span>) • Host: <span className="text-slate-300">{hostName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Synchronized Live Timer */}
          <div className={`px-3 sm:px-4 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-sm sm:text-base font-bold shadow-sm ${
            secondsRemaining < 300
              ? 'bg-rose-950/80 border-rose-600/50 text-rose-400 animate-pulse'
              : secondsRemaining < 900
              ? 'bg-amber-950/80 border-amber-600/50 text-amber-400'
              : 'bg-slate-900 border-slate-700 text-cyan-400'
          }`}>
            <Clock className="w-4 h-4 shrink-0" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Hindi / English Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowHindi(!showHindi);
              soundFx.playClick();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle Hindi translation"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{showHindi ? 'Bilingual ON' : 'English Only'}</span>
          </button>

          {/* Proctoring Status Chip */}
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
            tabSwitchesCount >= 2
              ? 'bg-red-950/90 border-red-500/80 text-red-300 animate-pulse ring-1 ring-red-500/50'
              : tabSwitchesCount === 1
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 animate-pulse'
              : 'bg-slate-900 border-slate-700 text-slate-300'
          }`}>
            {tabSwitchesCount >= 2 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            ) : tabSwitchesCount === 1 ? (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>
              {tabSwitchesCount === 0 
                ? 'Strict 2-Strike Anti-Cheat' 
                : tabSwitchesCount === 1 
                ? 'Warning Active (Strike 1/2)' 
                : `FINAL WARNING (Strike ${tabSwitchesCount}/2)`}
            </span>
          </div>

          {/* Mobile Question Palette Toggle */}
          <button
            type="button"
            onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            title="Toggle question grid"
          >
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Submit Test Button */}
          {!isSubmitted && (
            <button
              type="button"
              onClick={() => {
                soundFx.playWarning();
                setShowSubmitModal(true);
              }}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Examination Body or Results Screen */}
      {!isSubmitted ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Question & Options Area */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 overflow-y-auto">
            {/* Live Broadcast Message Banner */}
            {hostBroadcastMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto w-full mb-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg"
              >
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Megaphone className="w-4 h-4 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 uppercase tracking-wide text-[11px]">Host Live Announcement</span>
                    {hostBroadcastTime && (
                      <span className="text-[10px] text-amber-400/70 font-mono">{new Date(hostBroadcastTime).toLocaleTimeString()}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-white font-medium break-words">{hostBroadcastMsg}</p>
                </div>
              </motion.div>
            )}

            {/* Tab Switch Strike 1 Warning Alert Banner */}
            {tabSwitchesCount === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto w-full mb-4 p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/60 text-amber-100 text-xs flex items-center justify-between gap-3 shadow-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-amber-500/30 text-amber-300 shrink-0 animate-pulse">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-amber-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                      <span>⚠️ PROCTORING WARNING ACTIVE (STRIKE 1/2)</span>
                    </p>
                    <p className="text-white font-medium text-xs mt-0.5">
                      Tab switch or application departure detected. The host has been notified. <strong>1 warning strike remaining. Please keep this exam tab focused!</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProctorWarningModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow"
                >
                  View Warning
                </button>
              </motion.div>
            )}

            {/* Tab Switch Strike 2+ Urgent Warning Alert Banner */}
            {tabSwitchesCount >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto w-full mb-4 p-3.5 rounded-2xl bg-rose-500/20 border-2 border-rose-500/80 text-rose-100 text-xs flex items-center justify-between gap-3 shadow-xl ring-2 ring-rose-500/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-rose-500/30 text-rose-300 shrink-0 animate-pulse">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-rose-200 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                      <span>🚨 CRITICAL PROCTORING WARNING (STRIKE {tabSwitchesCount}/2)</span>
                    </p>
                    <p className="text-white font-medium text-xs mt-0.5">
                      Unauthorized tab departure detected. Host has been notified. <strong>Test will NOT be auto-submitted, but all departures are permanently flagged.</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProctorWarningModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow"
                >
                  View Warning
                </button>
              </motion.div>
            )}

            {currentQ ? (
              <div className="max-w-3xl mx-auto w-full space-y-6">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">Question {currentIdx + 1}</span>
                    <span className="text-slate-600">/</span>
                    <span>{totalQuestions}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium ml-2">
                      {currentQ.chapterName || 'General Reasoning'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {userAnswers[currentIdx] !== undefined ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Answered
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                        Not Answered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
                  <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                    {currentQ.questionEn}
                  </p>
                  {showHindi && currentQ.questionHi && (
                    <p className="text-sm sm:text-base font-normal text-slate-300 leading-relaxed pt-2 border-t border-slate-800/60 font-serif">
                      {currentQ.questionHi}
                    </p>
                  )}
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3 pt-2">
                  {currentQ.optionsEn.map((optEn, optIdx) => {
                    const isSelected = userAnswers[currentIdx] === optIdx;
                    const optHi = currentQ.optionsHi && currentQ.optionsHi[optIdx];
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10 text-white'
                            : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {letter}
                        </div>
                        <div className="flex-1 text-sm sm:text-base space-y-1">
                          <p className="leading-snug">{optEn}</p>
                          {showHindi && optHi && (
                            <p className="text-xs sm:text-sm text-slate-400 font-serif leading-snug">
                              {optHi}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">Loading questions...</div>
            )}

            {/* Bottom Question Controls Bar (Desktop + In-flow Mobile) */}
            <div className="flex flex-wrap max-w-3xl mx-auto w-full pt-6 mt-6 border-t border-slate-800 items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="live-inflow-prev-btn"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-sm font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                  aria-label="Previous Question"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  id="live-inflow-next-btn"
                  onClick={handleNext}
                  disabled={currentIdx === totalQuestions - 1}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                  aria-label="Next Question"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleReview}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
                    markedForReview.has(currentIdx)
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>{markedForReview.has(currentIdx) ? 'Marked for Review' : 'Mark Review'}</span>
                </button>

                {userAnswers[currentIdx] !== undefined && (
                  <button
                    type="button"
                    onClick={handleClearResponse}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Sticky Bottom Action Bar for Easy Thumb Reaching */}
            <div 
              id="live-mobile-sticky-nav"
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 p-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2 safe-area-pb"
            >
              <button
                type="button"
                id="live-mobile-sticky-prev-btn"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-slate-100 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer shadow-sm"
                aria-label="Previous Question"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleToggleReview}
                className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 min-h-[44px] cursor-pointer ${
                  markedForReview.has(currentIdx)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Mark question for review"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Review</span>
              </button>

              <button
                type="button"
                onClick={() => setMobilePaletteOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer shadow-sm shrink-0"
              >
                <LayoutGrid className="w-4 h-4 text-cyan-400" />
                <span>{currentIdx + 1}/{totalQuestions}</span>
              </button>

              <button
                type="button"
                id="live-mobile-sticky-next-btn"
                onClick={handleNext}
                disabled={currentIdx === totalQuestions - 1}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all min-h-[44px] cursor-pointer"
                aria-label="Next Question"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 text-white shrink-0" />
              </button>
            </div>
          </div>

          {/* Desktop Question Palette Sidebar */}
          <aside className="hidden lg:flex w-72 bg-slate-950 p-4 border-l border-slate-800 flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Palette ({totalQuestions})
                </h3>
                <span className="text-xs text-cyan-400 font-mono">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-500 shrink-0" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 shrink-0" />
                  <span>Not Answered ({unattemptedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500 border border-amber-400 shrink-0" />
                  <span>Marked Review ({reviewCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded ring-2 ring-blue-500 bg-blue-600/30 shrink-0" />
                  <span>Current Item</span>
                </div>
              </div>

              {/* Palette Grid */}
              <div className="grid grid-cols-5 gap-1.5 max-h-[50vh] overflow-y-auto p-1">
                {questions.map((_, idx) => {
                  const isCurrent = currentIdx === idx;
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isMarked = markedForReview.has(idx);

                  let bgClass = 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800';
                  if (isAnswered) {
                    bgClass = 'bg-emerald-600/90 border-emerald-500 text-white font-bold';
                  } else if (isMarked) {
                    bgClass = 'bg-amber-500/80 border-amber-400 text-black font-bold';
                  }

                  if (isCurrent) {
                    bgClass += ' ring-2 ring-cyan-400 shadow-md shadow-cyan-400/20';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentIdx(idx);
                        soundFx.playClick(640, 0.02);
                      }}
                      className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Live Connection Indicator */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
              <span className="font-mono text-[11px] text-slate-500">ID: {testId}</span>
            </div>
          </aside>

          {/* Mobile Bottom-Sheet Question Palette Drawer */}
          <AnimatePresence>
            {mobilePaletteOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobilePaletteOpen(false)}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                {/* Sheet Body */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative z-10 bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 max-h-[80vh] flex flex-col shadow-2xl safe-area-pb"
                >
                  {/* Handle bar */}
                  <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">
                        Question Palette ({totalQuestions})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobilePaletteOpen(false)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Status Legend Mobile */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 p-2.5 my-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-500 shrink-0" />
                      <span>Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 shrink-0" />
                      <span>Unanswered ({unattemptedCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500 border border-amber-400 shrink-0" />
                      <span>Review ({reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded ring-2 ring-blue-500 bg-blue-600/30 shrink-0" />
                      <span>Current</span>
                    </div>
                  </div>

                  {/* Grid on Mobile with 44px touch targets */}
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 overflow-y-auto p-1 flex-1 max-h-[45vh]">
                    {questions.map((_, idx) => {
                      const isCurrent = currentIdx === idx;
                      const isAnswered = userAnswers[idx] !== undefined;
                      const isMarked = markedForReview.has(idx);

                      let bgClass = 'bg-slate-950 border-slate-800 text-slate-300';
                      if (isAnswered) {
                        bgClass = 'bg-emerald-600 border-emerald-500 text-white font-bold';
                      } else if (isMarked) {
                        bgClass = 'bg-amber-500 border-amber-400 text-black font-bold';
                      }

                      if (isCurrent) {
                        bgClass += ' ring-2 ring-cyan-400 shadow-md shadow-cyan-400/20';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCurrentIdx(idx);
                            setMobilePaletteOpen(false);
                            soundFx.playClick(640, 0.02);
                          }}
                          className={`min-h-[44px] rounded-xl border text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Results View: Check if Examiner has allowed Immediate Results or Test Ended */
        (showImmediateResultsState || sessionStatus === 'ended') ? (
          /* Released Results & Score Card */
          <div className="p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-8 overflow-y-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Examination Results &amp; Solution Key
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Detailed evaluation for <strong className="text-cyan-300 font-semibold">{student.studentName}</strong> (Roll: <span className="font-mono text-slate-300">{student.rollNumber}</span>)
                </p>
              </div>

              {sessionStatus === 'ended' && !showImmediateResultsState && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Official results released upon test conclusion by examiner</span>
                </div>
              )}

              {/* Auto-submitted due to infraction warning */}
              {autoSubmittedReason && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-600/80 text-left space-y-1.5 shadow-xl">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                    <span>Test Auto-Submitted: Proctoring Violation Logged</span>
                  </div>
                  <p className="text-xs text-rose-100 font-medium">
                    {autoSubmittedReason}
                  </p>
                  <p className="text-[11px] text-rose-300/70 font-mono">
                    Total violations: {tabSwitchesCount} tab departure(s) • Transmitted to Examiner {hostName}
                  </p>
                </div>
              )}
            </div>

            {resultData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Your Score</p>
                  <p className="text-2xl font-black text-cyan-400">{resultData.score} / {resultData.maxScore}</p>
                  {typeof negativeMarking === 'number' && negativeMarking > 0 && (
                    <p className="text-[10px] text-slate-500 font-mono">(-{negativeMarking} per wrong)</p>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Percentage</p>
                  <p className="text-2xl font-black text-emerald-400">{resultData.percentage}%</p>
                  <p className="text-[10px] text-slate-500 font-mono">Min pass: 50%</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <p className="text-xs text-slate-400 font-medium">NIELIT Grade</p>
                  <p className="text-base sm:text-lg font-bold text-amber-400 truncate">{resultData.grade}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Official scale</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Accuracy</p>
                  <p className="text-2xl font-black text-purple-400">
                    {Math.round((resultData.correctCount / (answeredCount || 1)) * 100)}%
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">{resultData.correctCount} of {answeredCount} correct</p>
                </div>
              </div>
            )}

            {/* Question-by-Question Solution Review */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Solution Review &amp; Explanations
                </h3>
                <span className="text-xs text-slate-400">
                  {answeredCount} attempted • {unattemptedCount} skipped
                </span>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const userAns = userAnswers[idx];
                  const correctAns = typeof q.correctIndex === 'number' ? q.correctIndex : q.correctAnswer;
                  const isCorrect = userAns !== undefined && userAns === correctAns;
                  const isSkipped = userAns === undefined;

                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                          <p className="text-sm sm:text-base text-slate-200 font-medium">{q.questionEn}</p>
                          {showHindi && q.questionHi && (
                            <p className="text-xs sm:text-sm text-slate-400 font-serif">{q.questionHi}</p>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isSkipped
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isCorrect ? 'Correct (+1)' : isSkipped ? 'Unattempted (0)' : 'Incorrect (0)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {q.optionsEn.map((opt, oIdx) => {
                          const isThisCorrect = oIdx === correctAns;
                          const isThisSelected = oIdx === userAns;

                          let optClass = 'bg-slate-900 border-slate-800 text-slate-400';
                          if (isThisCorrect) {
                            optClass = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 font-semibold';
                          } else if (isThisSelected) {
                            optClass = 'bg-rose-950/80 border-rose-500/80 text-rose-300 font-semibold';
                          }

                          return (
                            <div key={oIdx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${optClass}`}>
                              <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {q.explanationEn && (
                        <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 space-y-1">
                          <span className="font-bold text-blue-300">Explanation:</span>
                          <p>{q.explanationEn}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={onLeave}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer border border-slate-700 shadow-md"
              >
                Exit to Host &amp; Join Page
              </button>
            </div>
          </div>
        ) : (
          /* Results Withheld by Host: Official Submission Receipt & Waiting Room */
          <div className="p-6 sm:p-10 max-w-2xl mx-auto w-full space-y-6 overflow-y-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Responses Recorded &amp; Transmitted
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Your examination answers have been securely synced with the examiner's server.
                </p>
              </div>

              {/* Policy Alert Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Immediate Candidate Results Withheld by Host</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Examiner <strong className="text-white">{hostName}</strong> has configured this live test session with immediate result disclosure disabled. Your answers, time records, and integrity checks are safely locked on the server.
                </p>
              </div>

              {/* Auto-submitted due to infraction warning */}
              {autoSubmittedReason && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-600/80 text-left space-y-1.5 shadow-xl">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                    <span>Test Auto-Submitted: Proctoring Violation Logged</span>
                  </div>
                  <p className="text-xs text-rose-100 font-medium">
                    {autoSubmittedReason}
                  </p>
                  <p className="text-[11px] text-rose-300/70 font-mono">
                    Total violations: {tabSwitchesCount} tab departure(s) • Transmitted to Examiner {hostName}
                  </p>
                </div>
              )}
            </div>

            {/* Candidate Submission Receipt */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Official Candidate Receipt
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                  ✓ Recorded
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 space-y-1">
                  <span className="text-slate-500 font-medium">Candidate Name:</span>
                  <p className="text-slate-200 font-bold text-sm">{student.studentName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 space-y-1">
                  <span className="text-slate-500 font-medium">Roll Number:</span>
                  <p className="text-cyan-400 font-mono font-bold text-sm">{student.rollNumber}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 space-y-1">
                  <span className="text-slate-500 font-medium">Test Session ID:</span>
                  <p className="text-slate-300 font-mono font-bold text-xs">{testId}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 space-y-1">
                  <span className="text-slate-500 font-medium">Submitted At:</span>
                  <p className="text-slate-300 font-medium">{submittedAtTime || new Date().toLocaleTimeString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 space-y-1">
                  <span className="text-slate-500 font-medium">Questions Attempted:</span>
                  <p className="text-slate-200 font-bold">{answeredCount} of {totalQuestions} questions</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/60 space-y-1">
                  <span className="text-slate-500 font-medium">Proctoring Status:</span>
                  <p className={`font-semibold ${tabSwitchesCount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {tabSwitchesCount === 0 ? 'Clean (0 tab switches)' : `${tabSwitchesCount} tab switch events logged`}
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time sync listener banner */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-300">
                  Live Examiner Listener Active
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  As soon as Examiner <strong className="text-slate-200">{hostName}</strong> releases the results or concludes the exam, this screen will automatically refresh to show your official score, grade, and question solutions.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onLeave}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer border border-slate-700 shadow-md"
              >
                Exit to Host &amp; Join Page
              </button>
            </div>
          </div>
        )
      )}

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Submit Examination?</h3>
                  <p className="text-xs text-slate-400">Review your attempt statistics before finalizing.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div>
                  <p className="text-xs text-slate-400">Answered</p>
                  <p className="text-lg font-bold text-emerald-400">{answeredCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Unattempted</p>
                  <p className="text-lg font-bold text-slate-400">{unattemptedCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">For Review</p>
                  <p className="text-lg font-bold text-amber-400">{reviewCount}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Once submitted, your answers will be securely transmitted to the Host session. You cannot make any further changes.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel &amp; Continue Test
                </button>
                <button
                  type="button"
                  onClick={submitExam}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Yes, Submit Now'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Strict Tab-Switch / Application-Departure Auto-Submit Warning Modal (3-Strike Policy) */}
      <AnimatePresence>
        {showProctorWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`max-w-md w-full rounded-2xl bg-slate-900 border-2 p-6 shadow-2xl space-y-5 ${
                tabSwitchesCount >= 2 
                  ? 'border-red-500 shadow-red-950/70 ring-2 ring-red-500/40' 
                  : 'border-amber-500 shadow-amber-950/60 ring-1 ring-amber-500/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 animate-bounce ${
                  tabSwitchesCount >= 2
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                }`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block border ${
                    tabSwitchesCount >= 2
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {tabSwitchesCount >= 2 ? `Official Strike ${tabSwitchesCount} of 2 (FINAL WARNING)` : 'Official Strike 1 of 2 Issued'}
                  </span>
                  <h3 className="text-lg font-black text-white tracking-tight">
                    {tabSwitchesCount >= 2 ? '🚨 Final Anti-Cheat Warning' : '⚠️ Anti-Cheat Warning'}
                  </h3>
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-xs space-y-2.5 leading-relaxed ${
                tabSwitchesCount >= 2
                  ? 'bg-red-950/40 border-red-500/30 text-red-100'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-100'
              }`}>
                <p className="font-semibold text-slate-200">
                  Candidate: <span className="text-white font-bold">{student.studentName}</span> (Roll: <span className="font-mono text-cyan-300">{student.rollNumber}</span>)
                </p>
                <p>
                  You navigated away from the active CBT exam window (switched browser tabs, minimized the window, or opened another application).
                </p>
                
                {tabSwitchesCount >= 2 ? (
                  <div className="font-bold text-white bg-red-900/70 p-3.5 rounded-xl border border-red-500/60 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                    <span>
                      FINAL WARNING (STRIKE 2/2): Examiner <u>{hostName}</u> has been alerted in real-time. This test will <strong>NOT be auto-submitted</strong> so you can finish all your answers, but all departures are permanently flagged on your institutional record.
                    </span>
                  </div>
                ) : (
                  <div className="font-bold text-white bg-amber-900/60 p-3.5 rounded-xl border border-amber-500/50 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      STRIKE 1 WARNING: You have <strong>1 STRIKE REMAINING</strong> under the 2-Strike Proctoring Policy. Both you and host <u>{hostName}</u> have received this warning. Please keep this exam window focused at all times.
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProctorWarningModal(false);
                    soundFx.playClick();
                    if (typeof window !== 'undefined') {
                      window.focus();
                    }
                  }}
                  className={`w-full py-3 rounded-xl text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    tabSwitchesCount >= 2
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-600/40'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/40'
                  }`}
                >
                  <span>{tabSwitchesCount >= 2 ? 'I Understand — Continue Examination' : 'Acknowledge Strike 1 — Return to Exam'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
