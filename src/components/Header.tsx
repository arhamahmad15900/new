import React, { useState } from 'react';
import { 
  FileText, 
  Award, 
  BookOpen, 
  CheckCircle2,
  Palette,
  Volume2,
  VolumeX,
  Compass,
  FileUp,
  Sparkles,
  Radio,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Layers,
  Monitor
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import { soundFx } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenSyllabus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSyllabus }) => {
  const { themeConfig, soundEnabled, setSoundEnabled } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    soundFx.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="no-print bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800/80 sticky top-0 z-40 shadow-xl transition-colors gpu-layer">
        {/* Top Gazette / Institutional Bar */}
        <div className="bg-slate-950/80 px-3 sm:px-4 py-1.5 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-400 truncate max-w-[200px] sm:max-w-none">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>NIELIT 'O' Level (IT)</span>
                <span className="hidden sm:inline">• Revision 5.1 (R5.1)</span>
              </span>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="hidden md:inline text-slate-300 text-[11px]">
                Author: <span className="font-semibold text-cyan-300">Arham Ahmad Khan</span>
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
              {onOpenSyllabus && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenSyllabus();
                    soundFx.playClick();
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer py-1 px-1.5 rounded"
                >
                  <Compass className="w-3 h-3 shrink-0" />
                  <span className="whitespace-nowrap">Syllabus</span>
                </button>
              )}

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                100 Qs / 90m &amp; 50 Qs / 45m
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-16 gap-2 sm:gap-4">
            {/* Logo & Title */}
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
              onClick={() => {
                setActiveTab('generator');
                soundFx.playClick();
              }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl blur-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30 ring-1 ring-white/20 shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="font-display text-sm sm:text-lg font-black text-white tracking-tight truncate group-hover:text-cyan-200 transition-colors">
                    'O' Level Test Generator
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-md shadow-xs">
                    R5.1
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden lg:block truncate font-medium">
                  M1 (IT Tools) • M2 (Web Design) • M3 (Python) • M4 (IoT)
                </p>
              </div>
            </motion.div>

            {/* Navigation Tabs & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Desktop Navigation Tabs (Hidden on mobile, handled by mobile bottom nav) */}
              <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/5 backdrop-blur-md">
                <button
                  id="tab-btn-host-join"
                  onClick={() => {
                    setActiveTab('host_join');
                    soundFx.playClick();
                  }}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer relative z-10 ${
                    activeTab === 'host_join'
                      ? 'text-white'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  {activeTab === 'host_join' && (
                    <motion.div
                      layoutId="activeHeaderPill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-xl shadow-md shadow-purple-600/40 ring-1 ring-white/20 -z-10"
                    />
                  )}
                  <Radio className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'host_join' ? 'text-white' : 'text-purple-400'} animate-pulse`} />
                  <span className="font-display tracking-tight">Host &amp; Join</span>
                </button>

                <button
                  id="tab-btn-pdf-reasoning"
                  onClick={() => {
                    setActiveTab('pdf_reasoning');
                    soundFx.playClick();
                  }}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer relative z-10 ${
                    activeTab === 'pdf_reasoning'
                      ? 'text-white'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  {activeTab === 'pdf_reasoning' && (
                    <motion.div
                      layoutId="activeHeaderPill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-md shadow-emerald-600/40 ring-1 ring-white/20 -z-10"
                    />
                  )}
                  <FileUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'pdf_reasoning' ? 'text-white' : 'text-emerald-400'}`} />
                  <span className="font-display tracking-tight">PDF Notes</span>
                </button>

                <button
                  id="tab-btn-generator"
                  onClick={() => {
                    setActiveTab('generator');
                    soundFx.playClick();
                  }}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer relative z-10 ${
                    activeTab === 'generator'
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {activeTab === 'generator' && (
                    <motion.div
                      layoutId="activeHeaderPill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-xl shadow-md shadow-blue-600/40 ring-1 ring-white/20 -z-10"
                    />
                  )}
                  <BookOpen className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'generator' ? 'text-white' : 'text-blue-400'}`} />
                  <span className="font-display tracking-tight">Generator</span>
                </button>
              </nav>

              <div className="h-5 w-px bg-slate-800/80 mx-0.5 hidden md:block" />

              {/* Theme Selector Trigger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setShowThemeModal(true);
                  soundFx.playClick();
                }}
                className="min-h-[38px] min-w-[38px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Change Theme & Aesthetics"
                aria-label="Change Theme"
              >
                <Palette className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="hidden lg:inline font-medium">{themeConfig.name}</span>
                <span className="text-xs hidden sm:inline">{themeConfig.icon}</span>
              </motion.button>

              {/* Quick Sound Mute Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  soundFx.enabled = next;
                  if (next) soundFx.playClick();
                }}
                className="min-h-[38px] min-w-[38px] sm:min-h-[40px] p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
                aria-label="Toggle Sound Effects"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
              </motion.button>

              {/* Mobile Menu Hamburger Toggle (Exposes All PC Options in Mobile View) */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                id="header-mobile-menu-btn"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  soundFx.playClick();
                }}
                className={`md:hidden min-h-[38px] min-w-[38px] p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                  mobileMenuOpen
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700/80 text-slate-300'
                }`}
                title={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-label="Toggle Mobile Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-200" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Full Navigation & Feature Drawer (Guarantees all PC options are accessible on mobile) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="header-mobile-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl overflow-hidden shadow-2xl safe-area-pb"
            >
              <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Section: Main Modes */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
                    <span>Navigation &amp; Examination Hub</span>
                    <span className="text-cyan-400 font-bold">R5.1</span>
                  </div>

                  {/* Host & Join Live Test */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('host_join')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all text-left cursor-pointer border ${
                      activeTab === 'host_join'
                        ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                        <Radio className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>Host &amp; Join Live Exam</span>
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded-full border border-purple-500/30">
                            Live Arena
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Host live test or join with student PIN</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* PDF Notes Reasoning Studio */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('pdf_reasoning')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all text-left cursor-pointer border ${
                      activeTab === 'pdf_reasoning'
                        ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                        <FileUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>PDF Notes Studio</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                            Strict PDF Only
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Upload handwritten/printed notes to generate tests</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Standard Test Generator */}
                  <button
                    type="button"
                    onClick={() => handleNavClick('generator')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all text-left cursor-pointer border ${
                      activeTab === 'generator'
                        ? 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>'O' Level Test Generator</span>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded-full border border-blue-500/30">
                            M1 - M4
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">100 Qs full mocks &amp; 50 Qs chapter drills</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Section: Secondary PC Options (Syllabus, Theme, Audio) */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
                    Configuration &amp; Quick Controls
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* View Full Syllabus */}
                    {onOpenSyllabus && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenSyllabus();
                          soundFx.playClick();
                          setMobileMenuOpen(false);
                        }}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <span className="text-xs font-bold block text-white">Full Syllabus</span>
                          <span className="text-[10px] text-slate-400">R5.1 Topics</span>
                        </div>
                      </button>
                    )}

                    {/* Theme Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowThemeModal(true);
                        soundFx.playClick();
                        setMobileMenuOpen(false);
                      }}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-left cursor-pointer"
                    >
                      <Palette className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-xs font-bold block text-white">Themes</span>
                        <span className="text-[10px] text-slate-400">{themeConfig.name}</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section: Institutional Gazette & Author Credit */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Award className="w-3.5 h-3.5" />
                      NIELIT Revision 5.1 (R5.1)
                    </span>
                    <span className="font-mono text-cyan-300">100 Qs / 90m</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-0.5">
                    Author: <strong className="text-white font-medium">Arham Ahmad Khan</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
    </>
  );
};
