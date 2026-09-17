import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  Award, 
  FileText, 
  RefreshCw, 
  Trash2, 
  Download, 
  AlertTriangle,
  Radio,
  CheckCircle2,
  Hourglass,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Megaphone,
  Send,
  Filter,
  Eye,
  EyeOff,
  ShieldAlert,
  X,
  Lock,
  Bell,
  AlertOctagon,
  AlertCircle,
  Volume2
} from 'lucide-react';
import { LiveTestStudent, LiveTestSession, ProctoringAlert } from '../../types';
import { soundFx } from '../../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface HostLiveControlRoomProps {
  testId: string;
  hostToken: string;
  initialSession: LiveTestSession;
  onExitServer: () => void;
  onHostNewTest?: () => void;
}

export const HostLiveControlRoom: React.FC<HostLiveControlRoomProps> = ({
  testId,
  hostToken,
  initialSession,
  onExitServer,
  onHostNewTest
}) => {
  const [session, setSession] = useState<LiveTestSession>(initialSession);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [confirmEndModal, setConfirmEndModal] = useState(false);
  const [confirmHostNewModal, setConfirmHostNewModal] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'lobby' | 'in_test' | 'submitted' | 'flagged'>('all');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  
  // Live Broadcast State
  const [broadcastInput, setBroadcastInput] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState(false);

  // Student Inspection Modal
  const [inspectedStudent, setInspectedStudent] = useState<LiveTestStudent | null>(null);

  // Proctoring Real-Time Alerts & Notification Toasts
  const [activeAlerts, setActiveAlerts] = useState<ProctoringAlert[]>(initialSession.proctoringAlerts || []);
  const seenAlertIdsRef = React.useRef<Set<string>>(new Set((initialSession.proctoringAlerts || []).map(a => a.id)));
  const [latestToastAlert, setLatestToastAlert] = useState<ProctoringAlert | null>(null);
  const [proctorFeedOpen, setProctorFeedOpen] = useState(true);

  // Polling loop: Refresh session every 1.5 seconds so host sees live joins, progress, submissions, and proctoring infractions
  useEffect(() => {
    let isMounted = true;

    const fetchSessionStatus = async () => {
      try {
        const res = await fetch(`/api/live-tests/${testId}/session?hostToken=${encodeURIComponent(hostToken)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && data.session) {
          const s = data.session;
          setSession((prev) => ({
            ...prev,
            ...s,
            students: s.students || []
          }));
          setLastRefreshed(new Date());

          // Check for incoming new proctoring events to notify host in real-time
          if (Array.isArray(s.proctoringAlerts) && s.proctoringAlerts.length > 0) {
            const incomingAlerts: ProctoringAlert[] = s.proctoringAlerts;
            const newUnseen = incomingAlerts.filter(a => !seenAlertIdsRef.current.has(a.id));
            if (newUnseen.length > 0) {
              newUnseen.forEach(a => seenAlertIdsRef.current.add(a.id));
              const topAlert = newUnseen[newUnseen.length - 1];
              setLatestToastAlert(topAlert);
              soundFx.playWarning();

              // Auto-dismiss the popup banner after 8 seconds
              setTimeout(() => {
                setLatestToastAlert(curr => (curr?.id === topAlert.id ? null : curr));
              }, 8000);
            }
            setActiveAlerts(incomingAlerts);
          }
        }
      } catch (err) {
        console.warn('Host polling error:', err);
      }
    };

    fetchSessionStatus();
    const interval = setInterval(fetchSessionStatus, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [testId, hostToken]);

  // Copy Test ID
  const handleCopyTestId = () => {
    navigator.clipboard.writeText(testId);
    setCopiedId(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Copy Join Link
  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?join=${encodeURIComponent(testId)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Host clicks "Start Test"
  const handleStartTest = async () => {
    setIsStarting(true);
    soundFx.playClick();

    try {
      const res = await fetch(`/api/live-tests/${testId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to start test');
        return;
      }

      setSession((prev) => ({
        ...prev,
        status: 'in_progress',
        startedAt: data.startedAt
      }));
      soundFx.playSuccess();
    } catch (err: any) {
      alert(err.message || 'Network error');
    } finally {
      setIsStarting(false);
    }
  };

  // Host clicks "End Test"
  const handleEndTest = async () => {
    setIsEnding(true);
    soundFx.playWarning();

    try {
      const res = await fetch(`/api/live-tests/${testId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken })
      });

      if (res.ok) {
        setSession((prev) => ({ ...prev, status: 'ended' }));
        setConfirmEndModal(false);
        soundFx.playSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnding(false);
    }
  };

  // Kick student
  const handleKickStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to remove "${studentName}" from this test session?`)) return;

    try {
      const res = await fetch(`/api/live-tests/${testId}/kick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken, studentId })
      });
      if (res.ok) {
        soundFx.playClick(400, 0.05);
        setSession((prev) => {
          const currentList = Array.isArray(prev.students) ? prev.students : Object.values(prev.students || {});
          return {
            ...prev,
            students: currentList.filter((s) => s.id !== studentId)
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export Results as CSV
  const handleExportCSV = () => {
    const studentList: LiveTestStudent[] = Array.isArray(session.students) 
      ? session.students 
      : Object.values(session.students || {});

    if (studentList.length === 0) {
      alert('No students have joined yet to export.');
      return;
    }

    let csv = 'Roll Number,Candidate Name,Status,Joined At,Answered Qs,Score,Max Marks,Percentage,Grade\n';
    studentList.forEach((s) => {
      const pct = s.percentage ?? (s.score ? Math.round((s.score / (session.questionCount || 1)) * 100) : 0);
      let grade = 'N/A';
      if (s.status === 'submitted') {
        if (pct >= 85) grade = 'S';
        else if (pct >= 75) grade = 'A';
        else if (pct >= 65) grade = 'B';
        else if (pct >= 55) grade = 'C';
        else if (pct >= 50) grade = 'D';
        else grade = 'F';
      }

      csv += `"${s.rollNumber}","${s.studentName}","${s.status}","${new Date(s.joinedAt).toLocaleTimeString()}","${s.answersCount || 0}","${s.score ?? 'N/A'}","${session.questionCount}","${pct}%","${grade}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${session.testId}_Exam_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    soundFx.playSuccess();
  };

  // Host sends live broadcast message
  const handleSendBroadcast = async (msgToSend?: string) => {
    const text = (msgToSend ?? broadcastInput).trim();
    if (!text) return;

    setIsSendingBroadcast(true);
    try {
      const res = await fetch(`/api/live-tests/${testId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken, message: text })
      });
      if (res.ok) {
        soundFx.playSuccess();
        setSession((prev) => ({
          ...prev,
          broadcastMessage: text,
          broadcastTime: new Date().toISOString()
        }));
        setBroadcastInput('');
        setBroadcastSuccessNotice(true);
        setTimeout(() => setBroadcastSuccessNotice(false), 3000);
      }
    } catch (e) {
      console.error('Failed to send broadcast:', e);
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  // Host clears live broadcast message
  const handleClearBroadcast = async () => {
    try {
      const res = await fetch(`/api/live-tests/${testId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostToken, message: '' })
      });
      if (res.ok) {
        soundFx.playClick();
        setSession((prev) => ({
          ...prev,
          broadcastMessage: undefined,
          broadcastTime: undefined
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Host toggles candidate immediate results visibility
  const handleToggleImmediateResults = async () => {
    const nextVal = !session.showImmediateResults;
    setIsUpdatingSettings(true);
    soundFx.playClick();
    try {
      const res = await fetch(`/api/live-tests/${testId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostToken,
          showImmediateResults: nextVal
        })
      });
      if (res.ok) {
        setSession((prev) => ({
          ...prev,
          showImmediateResults: nextVal
        }));
        soundFx.playSuccess();
      }
    } catch (e) {
      console.error('Failed to update immediate results setting:', e);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Host clicks "Host New Test"
  const handleHostNewTestClick = () => {
    soundFx.playClick();
    if (session.status === 'in_progress') {
      setConfirmHostNewModal(true);
    } else if (onHostNewTest) {
      onHostNewTest();
    }
  };

  const studentList: LiveTestStudent[] = Array.isArray(session.students)
    ? session.students
    : Object.values(session.students || {});

  const filteredStudents = studentList.filter((s) => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'lobby') return s.status === 'lobby';
    if (statusFilter === 'in_test') return s.status === 'in_test';
    if (statusFilter === 'submitted') return s.status === 'submitted';
    if (statusFilter === 'flagged') return (s.tabSwitchesCount || 0) > 0 || !!s.autoSubmitted || !!s.isFlagged;
    return true;
  });

  const totalJoined = studentList.length;
  const inLobbyCount = studentList.filter((s) => s.status === 'lobby').length;
  const inTestCount = studentList.filter((s) => s.status === 'in_test').length;
  const submittedCount = studentList.filter((s) => s.status === 'submitted').length;

  const averageScore = submittedCount > 0
    ? Math.round(
        studentList
          .filter((s) => typeof s.score === 'number')
          .reduce((acc, curr) => acc + (curr.score || 0), 0) / submittedCount
      )
    : 0;

  return (
    <div className="space-y-6 relative">
      {/* Real-Time Live Proctoring Violation Notification Toast for Host */}
      <AnimatePresence>
        {latestToastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-md w-full p-4 rounded-2xl bg-slate-900/95 border-2 border-rose-500 shadow-2xl shadow-rose-950/70 backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  latestToastAlert.isAutoSubmitted
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-rose-500/20 text-rose-400 animate-pulse'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      latestToastAlert.isAutoSubmitted
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                    }`}>
                      {latestToastAlert.isAutoSubmitted ? '🚨 AUTO-SUBMIT TRIGGERED' : '⚠️ CANDIDATE TAB SWITCH'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(latestToastAlert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">
                    {latestToastAlert.studentName} <span className="text-xs font-mono text-cyan-400">(Roll: {latestToastAlert.rollNumber})</span>
                  </h4>
                  <p className="text-xs text-rose-200 leading-snug">
                    {latestToastAlert.message}
                  </p>
                  <div className="pt-1.5 flex items-center gap-2">
                    {studentList.find(s => s.id === latestToastAlert.studentId) && (
                      <button
                        type="button"
                        onClick={() => {
                          const s = studentList.find(st => st.id === latestToastAlert.studentId);
                          if (s) setInspectedStudent(s);
                          setLatestToastAlert(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Inspect Candidate
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setLatestToastAlert(null)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLatestToastAlert(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Session Broadcast Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Test ID & Server Identity */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-blue-400" />
                Live Host Server
              </span>

              {session.status === 'waiting' && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Hourglass className="w-3 h-3 animate-spin" />
                  Waiting for Students in Lobby
                </span>
              )}

              {session.status === 'in_progress' && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Examination In Progress
                </span>
              )}

              {session.status === 'ended' && (
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold">
                  Test Concluded
                </span>
              )}

              {session.showImmediateResults ? (
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Immediate Results: ON
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  Results: Withheld
                </span>
              )}

              {typeof session.negativeMarking === 'number' && session.negativeMarking > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                  Negative: -{session.negativeMarking}
                </span>
              )}

              <span className="text-xs text-slate-400">
                {session.subOptionTitle}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {session.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Examiner / Host: <strong className="text-slate-200 font-semibold">{session.hostName}</strong> • {session.questionCount} Questions • {session.durationMinutes} Minutes
              </p>
            </div>

            {/* Test ID Highlight Card */}
            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-3 bg-slate-900/90 border border-cyan-500/40 px-4 py-2 rounded-2xl shadow-inner">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Student Test ID:
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400 tracking-wider select-all">
                  {session.testId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTestId}
                  className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
                  title="Copy Test ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Student Invite Link'}</span>
              </button>

              {session.passcode && (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>PIN: {session.passcode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Master Test Execution Control & Host New Test */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHostNewTestClick}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-blue-400/30"
                title="Configure and launch another test server"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Host New Test</span>
              </button>
            </div>

            {session.status === 'waiting' && (
              <div className="space-y-1 text-center sm:text-right">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleStartTest}
                  disabled={isStarting}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{isStarting ? 'Starting Session...' : 'Start Test for All Students'}</span>
                </motion.button>
                <p className="text-[11px] text-amber-400/90 font-medium">
                  Students will wait in lobby until you click this
                </p>
              </div>
            )}

            {session.status === 'in_progress' && (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmEndModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>End Test for Everyone</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Results (CSV)</span>
              </button>

              <button
                type="button"
                onClick={onExitServer}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Close Server
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Broadcast Announcement Panel */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Broadcast Announcement to All Students
              </h3>
              <p className="text-[11px] text-slate-400">
                Send real-time alerts or time notifications directly to all candidate screens.
              </p>
            </div>
          </div>

          {session.broadcastMessage && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active on Screens
              </span>
              <button
                type="button"
                onClick={handleClearBroadcast}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-[11px] border border-slate-700 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {session.broadcastMessage && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
              <p><strong className="font-semibold">Current Announcement:</strong> "{session.broadcastMessage}"</p>
            </div>
            <span className="text-[10px] text-amber-400/70 font-mono shrink-0">
              {session.broadcastTime ? new Date(session.broadcastTime).toLocaleTimeString() : ''}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={broadcastInput}
            onChange={(e) => setBroadcastInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendBroadcast();
            }}
            placeholder="Type an announcement to broadcast to all connected students..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => handleSendBroadcast()}
            disabled={isSendingBroadcast || !broadcastInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-lg shadow-amber-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSendingBroadcast ? 'Broadcasting...' : 'Broadcast'}</span>
          </button>
        </div>

        {/* Quick Announcement Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Alerts:</span>
          {[
            "15 minutes remaining! Please check unattempted questions.",
            "5 minutes remaining before automatic test submission.",
            "Reminder: Ensure you submit before time expires.",
            "Notice: Switching browser tabs is being monitored."
          ].map((msg, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendBroadcast(msg)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition-colors cursor-pointer"
            >
              {msg.length > 36 ? msg.slice(0, 34) + '...' : msg}
            </button>
          ))}
        </div>
      </div>

      {/* Immediate Results & Evaluation Policies Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              session.showImmediateResults 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              {session.showImmediateResults ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Immediate Candidate Results:
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  session.showImmediateResults
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {session.showImmediateResults ? '✓ Enabled (Visible Instantly)' : '🔒 Withheld by Host'}
                </span>
                {typeof session.negativeMarking === 'number' && session.negativeMarking > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
                    Negative Penalty: -{session.negativeMarking}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {session.showImmediateResults
                  ? 'Candidates view their live score, percentage, grade, and full question explanations immediately upon submitting.'
                  : 'Scores and answers are locked. Candidates receive an official submission receipt and wait for you to release results or conclude the exam.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleImmediateResults}
              disabled={isUpdatingSettings}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 ${
                session.showImmediateResults
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
              }`}
            >
              {session.showImmediateResults ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-400" />
                  <span>{isUpdatingSettings ? 'Updating...' : 'Withhold Immediate Results'}</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-white" />
                  <span>{isUpdatingSettings ? 'Releasing...' : 'Release Results to Candidates Now'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Joined</p>
            <p className="text-2xl font-bold text-white">{totalJoined}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">In Lobby</p>
            <p className="text-2xl font-bold text-amber-400">{inLobbyCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active In Test</p>
            <p className="text-2xl font-bold text-purple-400">{inTestCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Submitted</p>
            <p className="text-2xl font-bold text-emerald-400">{submittedCount}</p>
          </div>
        </div>
      </div>

      {/* Live Proctoring & Tab-Switch Audit Feed */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl border transition-all ${
              activeAlerts.length > 0 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
            }`}>
              {activeAlerts.length > 0 ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Live Proctoring &amp; Anti-Cheating Surveillance
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                  activeAlerts.length > 0 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {activeAlerts.length > 0 ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{activeAlerts.length} Event{activeAlerts.length === 1 ? '' : 's'} Logged</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automatic detection of candidate tab switches, window departures, and auto-submissions (3-strike rule).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setProctorFeedOpen(!proctorFeedOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            {proctorFeedOpen ? 'Hide Log' : 'View Log'}
          </button>
        </div>

        {proctorFeedOpen && (
          <div>
            {activeAlerts.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeAlerts.slice().reverse().map((alert) => {
                  const targetStudent = studentList.find(s => s.id === alert.studentId);
                  const strikes = alert.tabSwitchesCount || 1;
                  const isStrike2 = strikes === 2 || alert.eventType === 'tab_switch_warning_2';
                  const isStrikeGreater = strikes > 2;
                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                        isStrikeGreater
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                          : isStrike2
                          ? 'bg-red-950/20 border-red-500/30 text-red-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          isStrikeGreater
                            ? 'bg-red-600/30 text-red-200 border border-red-500/60 shadow-sm'
                            : isStrike2
                            ? 'bg-red-500/25 text-red-300 border border-red-500/40'
                            : alert.eventType === 'tab_switch_warning' || strikes === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {isStrikeGreater
                            ? `🚨 Strike ${strikes} (Warning Logged)`
                            : isStrike2
                            ? '🔥 Strike 2 Final Warning (2/2)'
                            : alert.eventType === 'tab_switch_warning' || strikes === 1
                            ? '⚠️ Strike 1 Warning (1/2)'
                            : '🚪 Browser Departure'}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-white mr-1.5">
                            {alert.studentName}
                          </span>
                          <span className="font-mono text-cyan-400 mr-2 text-[11px]">
                            ({alert.rollNumber})
                          </span>
                          <span className="text-slate-300">
                            {alert.message}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        {targetStudent && (
                          <button
                            type="button"
                            onClick={() => setInspectedStudent(targetStudent)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] cursor-pointer"
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>2-Strike Anti-Cheat Surveillance Active: All connected candidates are currently adhering to the active exam tab.</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tab departures trigger real-time audio chimes and log Strike 1 (Warning) and Strike 2 (Final Warning) to candidate and host. Exams are not auto-submitted, ensuring full completion while infractions are recorded.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connected Students Roster & Control Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Connected Candidates Roster ({totalJoined})
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync (1.5s)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search candidate name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({totalJoined})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('lobby')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'lobby'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            In Lobby ({inLobbyCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in_test')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'in_test'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            In Test ({inTestCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('submitted')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'submitted'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Submitted ({submittedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('flagged')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'flagged'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Proctor Flags ({studentList.filter((s) => (s.tabSwitchesCount || 0) > 0 || s.autoSubmitted).length})</span>
          </button>
        </div>

        {filteredStudents.length > 0 ? (
          <div>
            {/* Mobile Cards View (Visible on Small Screens < md) */}
            <div className="md:hidden divide-y divide-slate-800/80">
              {filteredStudents.map((s, idx) => {
                const pct = s.percentage ?? (s.score ? Math.round((s.score / (session.questionCount || 1)) * 100) : 0);
                const hasTabSwitches = (s.tabSwitchesCount || 0) > 0;

                return (
                  <div key={s.id} className="p-4 space-y-3 bg-slate-900/50 hover:bg-slate-800/30 transition-colors">
                    {/* Top Row: Avatar, Name, Roll, and Action buttons */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                          {s.studentName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white text-sm truncate">{s.studentName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                          </div>
                          <p className="font-mono text-xs font-semibold text-cyan-300">
                            Roll: {s.rollNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setInspectedStudent(s)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Inspect Candidate Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleKickStudent(s.id, s.studentName)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Remove student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Status Badges Row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {s.status === 'lobby' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          In Lobby
                        </span>
                      )}
                      {s.status === 'in_test' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                          In Test
                        </span>
                      )}
                      {s.status === 'submitted' && !s.autoSubmitted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          Submitted
                        </span>
                      )}
                      {s.autoSubmitted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600/30 text-rose-200 border border-rose-500/60 text-[11px] font-black inline-flex items-center gap-1" title={s.autoSubmittedReason || 'Auto-submitted due to 3-strike proctoring violation'}>
                          <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />
                          Auto-Submitted (3/3 Strikes)
                        </span>
                      )}
                      {!s.autoSubmitted && hasTabSwitches && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          (s.tabSwitchesCount || 0) >= 2
                            ? 'bg-red-500/25 text-red-300 border border-red-500/50 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`} title={`Proctoring: ${s.tabSwitchesCount}/2 Strikes`}>
                          {(s.tabSwitchesCount || 0) >= 2 ? (
                            <ShieldAlert className="w-3 h-3 text-red-400" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                          )}
                          <span>Strike {s.tabSwitchesCount}/2 {(s.tabSwitchesCount || 0) >= 2 ? '(Critical)' : '(Warned)'}</span>
                        </span>
                      )}
                    </div>

                    {/* Progress & Score Bar */}
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">
                          Answered: <strong className="text-white font-mono">{s.answersCount || 0}/{session.questionCount}</strong>
                        </span>
                        <div>
                          {s.status === 'submitted' ? (
                            <span className="font-bold text-emerald-400 font-mono">
                              Score: {s.score} ({pct}%)
                            </span>
                          ) : (
                            <span className="text-cyan-400 font-mono text-[11px]">
                              {Math.round(((s.answersCount || 0) / (session.questionCount || 1)) * 100)}% Done
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round(((s.answersCount || 0) / (session.questionCount || 1)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Visible on md and larger) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Status &amp; Proctoring</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredStudents.map((s, idx) => {
                    const pct = s.percentage ?? (s.score ? Math.round((s.score / (session.questionCount || 1)) * 100) : 0);
                    const hasTabSwitches = (s.tabSwitchesCount || 0) > 0;

                    return (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">{s.rollNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                              {s.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate max-w-[160px] sm:max-w-none">
                              <p>{s.studentName}</p>
                              <p className="text-[10px] text-slate-500 font-normal">
                                Joined {new Date(s.joinedAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {s.status === 'lobby' && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Waiting in Lobby
                              </span>
                            )}
                            {s.status === 'in_test' && (
                              <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                                Taking Test
                              </span>
                            )}
                            {s.status === 'submitted' && !s.autoSubmitted && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                Submitted
                              </span>
                            )}

                            {s.autoSubmitted && (
                              <span className="px-2.5 py-1 rounded-full bg-rose-600/30 text-rose-200 border border-rose-500/60 text-[11px] font-black inline-flex items-center gap-1 shadow-sm" title={s.autoSubmittedReason || 'Auto-submitted due to 3-strike proctoring violation'}>
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                Auto-Submitted (3/3 Strikes)
                              </span>
                            )}

                            {!s.autoSubmitted && hasTabSwitches && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                (s.tabSwitchesCount || 0) >= 2
                                  ? 'bg-red-500/25 text-red-300 border border-red-500/50 animate-pulse'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`} title={`Tab departures: Strike ${s.tabSwitchesCount}/2`}>
                                {(s.tabSwitchesCount || 0) >= 2 ? (
                                  <ShieldAlert className="w-3 h-3 text-red-400" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-amber-400" />
                                )}
                                <span>Strike {s.tabSwitchesCount}/2 {(s.tabSwitchesCount || 0) >= 2 ? '(Critical)' : '(Warned)'}</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>{s.answersCount || 0} / {session.questionCount}</span>
                              <span>{Math.round(((s.answersCount || 0) / (session.questionCount || 1)) * 100)}%</span>
                            </div>
                            <div className="w-24 sm:w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.round(((s.answersCount || 0) / (session.questionCount || 1)) * 100))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          {s.status === 'submitted' ? (
                            <span className="text-emerald-400">
                              {s.score} <span className="text-slate-500 text-xs">({pct}%)</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">In Progress</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectedStudent(s)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                              title="Inspect Candidate Record"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleKickStudent(s.id, s.studentName)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-600/40 transition-colors cursor-pointer"
                              title="Remove student from session"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
              <Users className="w-7 h-7 animate-pulse text-cyan-400" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-base font-bold text-white">
                {statusFilter !== 'all' ? 'No Candidates in this Filter' : 'Waiting for Students to Join Session'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Share Test ID <strong className="text-cyan-300 font-mono font-bold">{session.testId}</strong> with your candidates. As soon as they enter their details under "Join Test", they will appear in this live roster automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Quick Student Invite Link</span>
            </button>
          </div>
        )}
      </div>

      {/* Candidate Inspector Modal */}
      <AnimatePresence>
        {inspectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    {inspectedStudent.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{inspectedStudent.studentName}</h3>
                    <p className="text-xs font-mono text-cyan-400">Roll: {inspectedStudent.rollNumber}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedStudent(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500">Status</p>
                  <p className="font-bold text-white uppercase">{inspectedStudent.status}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500">Joined At</p>
                  <p className="font-bold text-white">{new Date(inspectedStudent.joinedAt).toLocaleTimeString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500">Questions Answered</p>
                  <p className="font-bold text-white">{inspectedStudent.answersCount || 0} / {session.questionCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500">Tab Switches</p>
                  <p className={`font-bold ${inspectedStudent.tabSwitchesCount ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {inspectedStudent.tabSwitchesCount || 0} detected
                  </p>
                </div>
              </div>

              {/* Auto-Submit Proctoring Flag */}
              {inspectedStudent.autoSubmitted && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/60 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                    <span>Test Auto-Submitted Due to Proctoring Violation</span>
                  </div>
                  <p className="text-rose-100">
                    {inspectedStudent.autoSubmittedReason || 'Student switched tabs or changed applications after initial warning.'}
                  </p>
                </div>
              )}

              {/* Proctoring Event Log for this Student */}
              {activeAlerts.filter(a => a.studentId === inspectedStudent.id).length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                    Proctoring Audit Log ({activeAlerts.filter(a => a.studentId === inspectedStudent.id).length} recorded)
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {activeAlerts.filter(a => a.studentId === inspectedStudent.id).map(evt => (
                      <div key={evt.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-rose-300">{evt.message}</span>
                        <span className="text-slate-500 font-mono shrink-0 ml-2">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inspectedStudent.status === 'submitted' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                  <p className="font-bold text-emerald-300">Final Examination Result</p>
                  <p className="text-white">
                    Score: <strong>{inspectedStudent.score}</strong> / {session.questionCount} • Percentage: <strong>{inspectedStudent.percentage}%</strong>
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectedStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Host New Test Modal */}
      <AnimatePresence>
        {confirmHostNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Host a New Test?</h3>
                  <p className="text-xs text-slate-400">Current Test ID: {session.testId}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Your currently active examination will remain running on the server. You can configure and deploy a new test, and switch between your hosted sessions at any time from the Host tab.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmHostNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Stay in Current Room
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmHostNewModal(false);
                    if (onHostNewTest) onHostNewTest();
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Configure New Test
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm End Modal */}
      <AnimatePresence>
        {confirmEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">End Test for All Students?</h3>
                  <p className="text-xs text-slate-400">This action will immediately conclude the examination.</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                All currently connected students will have their existing answers locked and submitted automatically. Are you sure you want to end the session?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmEndModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEndTest}
                  disabled={isEnding}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isEnding ? 'Concluding...' : 'Yes, End Test Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
