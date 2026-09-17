import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  Hash, 
  User, 
  Clock, 
  Hourglass, 
  ShieldCheck, 
  AlertCircle, 
  Users, 
  Radio, 
  CheckCircle2, 
  ArrowRight,
  LogOut,
  Sparkles,
  BookOpen,
  Lock
} from 'lucide-react';
import { LiveTestStudent, LiveTestSession, Question } from '../../types';
import { soundFx } from '../../utils/audio';
import { LiveStudentCBT } from './LiveStudentCBT';
import { motion } from 'motion/react';

interface JoinTestLobbyProps {
  initialTestId?: string;
}

export const JoinTestLobby: React.FC<JoinTestLobbyProps> = ({ initialTestId = '' }) => {
  // Join Form State
  const [testIdInput, setTestIdInput] = useState(initialTestId);
  const [studentNameInput, setStudentNameInput] = useState('');
  const [rollNumberInput, setRollNumberInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');

  // Join status
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Active Session State for candidate
  const [activeSession, setActiveSession] = useState<LiveTestSession | null>(null);
  const [currentStudent, setCurrentStudent] = useState<LiveTestStudent | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  // Check sessionStorage for previous joined session
  useEffect(() => {
    try {
      const savedStudent = sessionStorage.getItem('nielit_live_student');
      const savedTestId = sessionStorage.getItem('nielit_live_test_id');
      if (savedStudent && savedTestId) {
        const parsed = JSON.parse(savedStudent);
        setCurrentStudent(parsed);
        setTestIdInput(savedTestId);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Update input if initialTestId changes
  useEffect(() => {
    if (initialTestId) {
      setTestIdInput(initialTestId.toUpperCase());
    }
  }, [initialTestId]);

  // Polling effect when student is joined to check if host clicked "Start Test"
  useEffect(() => {
    if (!currentStudent || !activeSession?.testId) return;

    let isMounted = true;

    const pollStatus = async () => {
      try {
        const res = await fetch(
          `/api/live-tests/${activeSession.testId}/session?studentId=${encodeURIComponent(currentStudent.id)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data.success) return;

        setActiveSession(data.session);

        // If questions are returned (because test started or ended), store them
        if (data.session.questions && data.session.questions.length > 0) {
          setSessionQuestions(data.session.questions);
        }

        // Check if student was kicked
        if (data.session.students) {
          const list = Array.isArray(data.session.students) 
            ? data.session.students 
            : Object.values(data.session.students);
          const stillThere = list.some((s: any) => s.id === currentStudent.id);
          if (!stillThere) {
            handleLeaveSession('You were removed from the test session by the host.');
          }
        }
      } catch (err) {
        console.warn('Student polling error:', err);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentStudent, activeSession?.testId]);

  // Handle Joining
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    const cleanId = testIdInput.trim().toUpperCase();
    const cleanName = studentNameInput.trim();
    const cleanRoll = rollNumberInput.trim();

    if (!cleanId) {
      setJoinError('Please enter the Test ID provided by your examiner.');
      return;
    }
    if (!cleanName) {
      setJoinError('Please enter your full Candidate Name.');
      return;
    }
    if (!cleanRoll) {
      setJoinError('Please enter your Roll Number.');
      return;
    }

    setIsJoining(true);
    soundFx.playClick();

    try {
      const res = await fetch(`/api/live-tests/${cleanId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: cleanName,
          rollNumber: cleanRoll,
          passcode: passcodeInput.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to join test. Please check the Test ID.');
      }

      setCurrentStudent(data.student);
      setActiveSession(data.session);
      if (data.session.questions && data.session.questions.length > 0) {
        setSessionQuestions(data.session.questions);
      }

      // Persist in sessionStorage
      sessionStorage.setItem('nielit_live_student', JSON.stringify(data.student));
      sessionStorage.setItem('nielit_live_test_id', cleanId);

      soundFx.playSuccess();
    } catch (err: any) {
      setJoinError(err.message || 'Error joining test session.');
      soundFx.playWarning();
    } finally {
      setIsJoining(false);
    }
  };

  // Leave Lobby
  const handleLeaveSession = (msg?: string) => {
    soundFx.playClick(500, 0.04);
    sessionStorage.removeItem('nielit_live_student');
    sessionStorage.removeItem('nielit_live_test_id');
    setCurrentStudent(null);
    setActiveSession(null);
    setSessionQuestions([]);
    if (msg) {
      setJoinError(msg);
    }
  };

  // Case 1: Student is in active test that host has started (or recently ended)!
  if (currentStudent && activeSession && (activeSession.status === 'in_progress' || activeSession.status === 'ended') && sessionQuestions.length > 0) {
    return (
      <LiveStudentCBT
        testId={activeSession.testId}
        student={currentStudent}
        questions={sessionQuestions}
        durationMinutes={activeSession.durationMinutes}
        startedAt={activeSession.startedAt}
        testTitle={activeSession.title}
        hostName={activeSession.hostName}
        showImmediateResults={activeSession.showImmediateResults ?? true}
        negativeMarking={activeSession.negativeMarking ?? 0}
        onLeave={() => handleLeaveSession()}
      />
    );
  }

  // Case 2: Student has joined and is waiting in the Lobby for Host to click "Start Test"
  if (currentStudent && activeSession) {
    const peersList: LiveTestStudent[] = Array.isArray(activeSession.students)
      ? activeSession.students
      : Object.values(activeSession.students || {});

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Waiting Lobby Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-slate-950/80 space-y-6 text-center relative overflow-hidden">
          {/* Ambient decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Waiting Radar Indicator */}
          <div className="relative inline-flex items-center justify-center my-2">
            <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 animate-ping opacity-40 scale-125 pointer-events-none" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/20">
              <Hourglass className="w-10 h-10 animate-spin text-cyan-400" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-slate-900" />
            </span>
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected • Waiting for Examiner
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Awaiting Test Session Launch
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Your candidate credential is authenticated. The question booklet will immediately synchronize on screen once <strong className="text-cyan-300 font-bold">{activeSession.hostName}</strong> starts the exam.
            </p>
          </div>

          {/* Candidate Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left shadow-inner">
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Candidate Name</p>
              <p className="text-sm font-bold text-white truncate">{currentStudent.studentName}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Roll Number</p>
              <p className="text-sm font-bold font-mono text-cyan-300 truncate">{currentStudent.rollNumber}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Test ID</p>
              <p className="text-sm font-bold font-mono text-purple-300 truncate">{activeSession.testId}</p>
            </div>
          </div>

          {/* Test Paper Overview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/30 border border-blue-800/40 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                Target Exam Paper
              </p>
              <p className="text-sm font-black text-white font-display">{activeSession.title}</p>
              <p className="text-xs text-slate-300 font-mono">
                {activeSession.questionCount} Questions • {activeSession.durationMinutes} Minutes
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="px-3 py-1 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-200 text-xs font-bold inline-block">
                {activeSession.subOptionTitle}
              </span>
            </div>
          </div>

          {/* Proctoring Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 space-y-0.5">
              <span className="font-bold">2-Strike Anti-Cheat System Active:</span>
              <p className="text-[11px] text-amber-300/90 leading-tight">
                Please remain on this browser tab during the exam. Tab switching triggers real-time warnings to both you and the host examiner (the test will not auto-submit).
              </p>
            </div>
          </div>

          {/* Connected Peers in Lobby */}
          <div className="space-y-3 pt-2 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Users className="w-4 h-4 text-cyan-400" />
                Connected Candidates ({peersList.length})
              </span>
              <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Active
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
              {peersList.map((peer) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={peer.id}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                    peer.id === currentStudent.id
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-100 font-bold shadow-xs'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate max-w-[130px]">{peer.studentName}</span>
                  <span className="font-mono text-[10px] text-slate-400">({peer.rollNumber})</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leave Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => handleLeaveSession()}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Lobby / Cancel</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Case 3: Initial Join Form
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-xl mx-auto space-y-6"
    >
      {/* Join Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-md shadow-purple-600/20">
              <LogIn className="w-4.5 h-4.5" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
              Join Examination Room
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter the unique Test ID provided by your examiner along with your candidate credentials to connect to the live examination server.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          {/* Test ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-purple-400" />
              Test ID
            </label>
            <input
              type="text"
              required
              value={testIdInput}
              onChange={(e) => setTestIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. NL-AB-1234"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-base font-mono font-bold text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 uppercase tracking-wider transition-all"
            />
            <p className="text-[11px] text-slate-500">
              The 8-character unique code generated by the test host.
            </p>
          </div>

          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Candidate Full Name
            </label>
            <input
              type="text"
              required
              value={studentNameInput}
              onChange={(e) => setStudentNameInput(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Roll Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Roll Number / Registration No.
            </label>
            <input
              type="text"
              required
              value={rollNumberInput}
              onChange={(e) => setRollNumberInput(e.target.value)}
              placeholder="e.g. 240182749"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Optional Session Passcode / PIN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Session Passcode / PIN
              </label>
              <span className="text-[11px] text-slate-500">Only if set by host</span>
            </div>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="e.g. 1234 (Leave blank if open session)"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-purple-300 placeholder-slate-600 focus:outline-none focus:border-purple-500 tracking-wider transition-all"
            />
          </div>

          {/* Join Error */}
          {joinError && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5 shadow-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <p>{joinError}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isJoining}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-display font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all border border-white/10"
          >
            <LogIn className="w-4 h-4" />
            <span>{isJoining ? 'Connecting to Room...' : 'Join Examination Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </div>

      {/* Information Helper Box */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <p className="font-bold text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Candidate Guidelines
        </p>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
          <li>Once you click Join, you will enter the waiting lobby until the examiner launches the session.</li>
          <li>All questions and the timer synchronize to the millisecond across all connected devices.</li>
          <li>Strict tab monitoring is enforced: switching windows or closing the exam tab triggers an automatic submission.</li>
        </ul>
      </div>
    </motion.div>
  );
};
