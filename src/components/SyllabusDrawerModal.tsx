import React, { useState } from 'react';
import { ModuleId } from '../types';
import { MODULES_INFO } from '../data/syllabus';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Code, 
  FileSpreadsheet, 
  Cpu, 
  Globe, 
  Search,
  ExternalLink,
  Zap
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface SyllabusDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModuleId: ModuleId;
  onSelectChapter?: (chapNumber: number) => void;
}

export const SyllabusDrawerModal: React.FC<SyllabusDrawerModalProps> = ({
  isOpen,
  onClose,
  initialModuleId,
  onSelectChapter
}) => {
  const [activeModule, setActiveModule] = useState<ModuleId>(initialModuleId);
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const moduleInfo = MODULES_INFO[activeModule];
  const activeChapter = moduleInfo.chapters.find((c) => c.number === selectedChapterNum) || moduleInfo.chapters[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl text-white overflow-hidden gpu-layer"
        >
          {/* Top Bar */}
          <div className="p-3.5 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>NIELIT Syllabus & Topic Inspector</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    R5.1 Official
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Comprehensive topic breakdown, chapter formulas & high-probability concepts
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Selector Pill Tabs */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center gap-2">
            {(['M1', 'M2', 'M3', 'M4'] as ModuleId[]).map((mId) => {
              const info = MODULES_INFO[mId];
              const isSelected = activeModule === mId;
              return (
                <button
                  key={mId}
                  onClick={() => {
                    setActiveModule(mId);
                    setSelectedChapterNum(1);
                    soundFx.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{info.code}</span>
                  <span className="hidden sm:inline font-normal opacity-80">({info.totalChapters} Chaps)</span>
                </button>
              );
            })}
          </div>

          {/* Main Content: Split Master-Detail */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Chapters List Sidebar */}
            <div className="w-full md:w-72 max-h-48 md:max-h-none bg-slate-950/50 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-y-auto overscroll-contain space-y-1.5 shrink-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                Chapters in {moduleInfo.code}
              </div>
              {moduleInfo.chapters.map((chap) => {
                const isSelected = chap.number === selectedChapterNum;
                return (
                  <button
                    key={chap.number}
                    onClick={() => {
                      setSelectedChapterNum(chap.number);
                      soundFx.playClick(750, 0.03);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-start gap-2 select-none touch-manipulation ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {chap.number}
                    </span>
                    <div className="flex-1 leading-tight line-clamp-2">
                      {chap.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chapter Detail Panel */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto overscroll-contain space-y-4 sm:space-y-5 bg-slate-900/60">
              {/* Chapter Header */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold font-mono">
                    {moduleInfo.code} • CHAPTER {activeChapter.number}
                  </span>

                  {onSelectChapter && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectChapter(activeChapter.number);
                        soundFx.playSuccess();
                        onClose();
                      }}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Focus this Chapter in Test</span>
                    </button>
                  )}
                </div>

                <h4 className="text-lg font-bold text-white tracking-tight">
                  {activeChapter.title}
                </h4>
                <p className="text-xs text-slate-400 font-hindi">
                  {activeChapter.hindiTitle}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {activeChapter.description}
                </p>
              </div>

              {/* Core Syllabus Topics */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Key Syllabus Concepts Tested by NIELIT:
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeChapter.topics.map((topic, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5 hover:border-slate-600 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 leading-snug">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
