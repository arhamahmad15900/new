import React from 'react';
import { 
  Radio, 
  FileUp, 
  BookOpen, 
  Monitor, 
  FileText,
  Compass,
  Palette
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  activeTab: 'generator' | 'paper' | 'cbt' | 'pdf_reasoning' | 'host_join';
  setActiveTab: (tab: any) => void;
  onOpenSyllabus?: () => void;
  onOpenTheme?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSyllabus,
  onOpenTheme
}) => {
  // Only hide when in interactive CBT exam mode, where CBT has its own fixed bottom thumb controls
  const isCbtActive = activeTab === 'cbt';
  if (isCbtActive) {
    return null;
  }

  return (
    <div className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.5)] safe-area-pb gpu-layer select-none">
      <nav className="flex items-center justify-around max-w-lg mx-auto">
        {/* Host & Join */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('host_join');
            soundFx.playClick();
          }}
          className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer relative min-h-[52px] ${
            activeTab === 'host_join'
              ? 'text-white'
              : 'text-purple-300/70 hover:text-purple-200'
          }`}
        >
          {activeTab === 'host_join' && (
            <motion.div
              layoutId="mobileNavIndicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-x-1.5 inset-y-1 bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/40 rounded-xl -z-10"
            />
          )}
          <div className="relative">
            <Radio className={`w-5 h-5 ${activeTab === 'host_join' ? 'text-purple-300 animate-pulse' : 'text-purple-400/80'}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] font-display font-bold tracking-tight">Host &amp; Join</span>
        </button>

        {/* PDF Notes */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('pdf_reasoning');
            soundFx.playClick();
          }}
          className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer relative min-h-[52px] ${
            activeTab === 'pdf_reasoning'
              ? 'text-white'
              : 'text-emerald-300/70 hover:text-emerald-200'
          }`}
        >
          {activeTab === 'pdf_reasoning' && (
            <motion.div
              layoutId="mobileNavIndicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-x-1.5 inset-y-1 bg-gradient-to-tr from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 rounded-xl -z-10"
            />
          )}
          <FileUp className={`w-5 h-5 ${activeTab === 'pdf_reasoning' ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
          <span className="text-[10px] font-display font-bold tracking-tight">PDF Notes</span>
        </button>

        {/* Generator */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('generator');
            soundFx.playClick();
          }}
          className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer relative min-h-[52px] ${
            activeTab === 'generator'
              ? 'text-white'
              : 'text-blue-300/70 hover:text-blue-200'
          }`}
        >
          {activeTab === 'generator' && (
            <motion.div
              layoutId="mobileNavIndicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-x-1.5 inset-y-1 bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-500/40 rounded-xl -z-10"
            />
          )}
          <BookOpen className={`w-5 h-5 ${activeTab === 'generator' ? 'text-blue-300' : 'text-blue-400/80'}`} />
          <span className="text-[10px] font-display font-bold tracking-tight">Generator</span>
        </button>

        {/* If Paper mode is active, show active Exam Paper tab */}
        {activeTab === 'paper' && (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
            }}
            className="flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer relative min-h-[52px] text-amber-300"
          >
            <motion.div
              layoutId="mobileNavIndicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-x-1.5 inset-y-1 bg-amber-500/20 border border-amber-400/50 rounded-xl -z-10"
            />
            <FileText className="w-5 h-5 text-amber-300" />
            <span className="text-[10px] font-display font-bold tracking-tight">
              Exam Paper
            </span>
          </button>
        )}

        {/* Syllabus Trigger */}
        {onOpenSyllabus && (
          <button
            type="button"
            onClick={() => {
              onOpenSyllabus();
              soundFx.playClick();
            }}
            className="flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-xl text-slate-400 hover:text-cyan-300 transition-all cursor-pointer min-h-[52px]"
          >
            <Compass className="w-5 h-5 text-cyan-400/80" />
            <span className="text-[10px] font-display font-semibold tracking-tight">Syllabus</span>
          </button>
        )}
      </nav>
    </div>
  );
};
