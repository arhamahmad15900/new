import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Radio, 
  LogIn, 
  Server, 
  Users, 
  Award, 
  Sparkles, 
  FileText, 
  Clock, 
  CheckCircle2,
  Share2,
  ShieldCheck
} from 'lucide-react';
import { HostServerSetup } from './HostServerSetup';
import { HostLiveControlRoom } from './HostLiveControlRoom';
import { JoinTestLobby } from './JoinTestLobby';
import { LiveTestSession } from '../../types';
import { soundFx } from '../../utils/audio';

export const HostAndJoinTestPage: React.FC = () => {
  // Main Tab: 'host' | 'join'
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');

  // URL query parameter check (e.g. ?join=NL-AB-1234)
  const [initialJoinId, setInitialJoinId] = useState<string>('');

  // Host Active Session
  const [activeHostSession, setActiveHostSession] = useState<{
    testId: string;
    hostToken: string;
    session: LiveTestSession;
  } | null>(null);

  const [isConfiguringNewHost, setIsConfiguringNewHost] = useState(false);

  useEffect(() => {
    // Check URL parameters for ?join=
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      setInitialJoinId(joinCode.toUpperCase());
      setActiveTab('join');
    }

    // Check sessionStorage for existing active host session
    try {
      const savedHost = sessionStorage.getItem('nielit_live_host_session');
      if (savedHost) {
        const parsed = JSON.parse(savedHost);
        if (parsed.testId && parsed.hostToken) {
          setActiveHostSession(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleServerCreated = (data: { testId: string; hostToken: string; session: LiveTestSession }) => {
    setActiveHostSession(data);
    setIsConfiguringNewHost(false);
    try {
      sessionStorage.setItem('nielit_live_host_session', JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  };

  const handleExitHostServer = () => {
    sessionStorage.removeItem('nielit_live_host_session');
    setActiveHostSession(null);
    setIsConfiguringNewHost(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Hero / Tab Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-slate-900/85 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-950/60"
      >
        {/* Ambient Top Rim Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -top-24 right-10 w-72 h-72 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-xs">
                Synchronized Live Testing System
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
              Host &amp; Join Live Exam
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Orchestrate real-time synchronized examination arenas with unique Test IDs, anti-cheat surveillance, or join instantly as a candidate.
            </p>
          </div>

          {/* Tab Switcher: Host Test vs Join Test with Motion layoutId */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner shrink-0">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('host');
              }}
              className={`relative py-3 sm:py-2.5 px-3 sm:px-5 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer z-10 min-h-[44px] ${
                activeTab === 'host'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {activeTab === 'host' && (
                <motion.div
                  layoutId="hostJoinTabIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/30 ring-1 ring-white/20 -z-10"
                />
              )}
              <Server className="w-4 h-4 shrink-0" />
              <span className="truncate">Host Test</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('join');
              }}
              className={`relative py-3 sm:py-2.5 px-3 sm:px-5 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer z-10 min-h-[44px] ${
                activeTab === 'join'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {activeTab === 'join' && (
                <motion.div
                  layoutId="hostJoinTabIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-600/30 ring-1 ring-white/20 -z-10"
                />
              )}
              <LogIn className="w-4 h-4 shrink-0" />
              <span className="truncate">Join Test</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-semibold truncate">Sub-second Live Sync</span>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold truncate">2-Strike Anti-Cheat</span>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-300">
            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">Real-Time Control Room</span>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold truncate">Instant CBT Analytics</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      {activeTab === 'host' ? (
        activeHostSession && !isConfiguringNewHost ? (
          <HostLiveControlRoom
            testId={activeHostSession.testId}
            hostToken={activeHostSession.hostToken}
            initialSession={activeHostSession.session}
            onExitServer={handleExitHostServer}
            onHostNewTest={() => setIsConfiguringNewHost(true)}
          />
        ) : (
          <HostServerSetup 
            onServerCreated={handleServerCreated} 
            onCancel={() => setIsConfiguringNewHost(false)}
            activeCount={activeHostSession ? 1 : 0}
          />
        )
      ) : (
        <JoinTestLobby initialTestId={initialJoinId} />
      )}
    </div>
  );
};
