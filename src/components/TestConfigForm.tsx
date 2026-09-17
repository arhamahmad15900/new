import React, { useState } from 'react';
import { 
  FileText, 
  Settings2, 
  Layers, 
  Clock, 
  CheckSquare, 
  BookMarked, 
  Sparkles, 
  Hash, 
  User, 
  HelpCircle,
  Shuffle,
  Award,
  Printer,
  Play,
  Monitor,
  Zap,
  Gauge,
  Compass,
  CheckCircle2,
  Flame,
  Target,
  BarChart3,
  Bookmark,
  BookOpen,
  Laptop,
  Globe,
  Code,
  Cpu,
  Terminal
} from 'lucide-react';
import { ModuleId, TestConfiguration } from '../types';
import { MODULES_INFO } from '../data/syllabus';
import { useTheme } from '../context/ThemeContext';
import { soundFx } from '../utils/audio';
import { motion } from 'motion/react';

const MODULE_THEMES: Record<ModuleId, {
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  gradient: string;
  icon: React.ElementType;
  label: string;
}> = {
  M1: {
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-400/40',
    badgeText: 'text-emerald-300',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
    icon: Laptop,
    label: 'IT Tools'
  },
  M2: {
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-400/40',
    badgeText: 'text-amber-300',
    gradient: 'from-amber-600 via-orange-600 to-amber-700',
    icon: Globe,
    label: 'Web Design'
  },
  M3: {
    badgeBg: 'bg-indigo-500/20',
    badgeBorder: 'border-indigo-400/40',
    badgeText: 'text-indigo-300',
    gradient: 'from-indigo-600 via-purple-600 to-violet-700',
    icon: Code,
    label: 'Python'
  },
  M4: {
    badgeBg: 'bg-cyan-500/20',
    badgeBorder: 'border-cyan-400/40',
    badgeText: 'text-cyan-300',
    gradient: 'from-cyan-600 via-teal-600 to-blue-700',
    icon: Cpu,
    label: 'IoT'
  }
};

interface TestConfigFormProps {
  onGenerate: (config: TestConfiguration, mode: 'cbt' | 'paper') => void;
  initialConfig: TestConfiguration;
  onOpenSyllabus?: () => void;
}

export const TestConfigForm: React.FC<TestConfigFormProps> = ({ 
  onGenerate, 
  initialConfig,
  onOpenSyllabus 
}) => {
  const { themeConfig, theme } = useTheme();

  const [moduleId, setModuleId] = useState<ModuleId>(initialConfig.moduleId);
  const [testType, setTestType] = useState<'standard' | 'chapter_wise'>(initialConfig.testType);
  const [selectedChapters, setSelectedChapters] = useState<number[]>(initialConfig.selectedChapters);
  const [questionCount, setQuestionCount] = useState<100 | 50>(initialConfig.questionCount);
  const [durationMinutes, setDurationMinutes] = useState<90 | 45>(initialConfig.durationMinutes);
  const [bookletSeries, setBookletSeries] = useState<'A' | 'B' | 'C' | 'D'>(initialConfig.bookletSeries);
  const [candidateName, setCandidateName] = useState(initialConfig.candidateName || '');
  const [rollNumber, setRollNumber] = useState(initialConfig.rollNumber || '');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'examjila' | 'nielit_pyq' | 'nielit_model'>(initialConfig.sourceFilter);
  const [shuffleQuestions, setShuffleQuestions] = useState(initialConfig.shuffleQuestions);
  const [shuffleOptions, setShuffleOptions] = useState(initialConfig.shuffleOptions);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(initialConfig.includeAnswerKey);
  const [includeExplanations, setIncludeExplanations] = useState(initialConfig.includeExplanations);
  const [includeOMRSheet, setIncludeOMRSheet] = useState(initialConfig.includeOMRSheet);

  const activeModule = MODULES_INFO[moduleId];

  // Handle module change
  const handleModuleChange = (newModuleId: ModuleId) => {
    soundFx.playClick(680, 0.04);
    setModuleId(newModuleId);
    const mod = MODULES_INFO[newModuleId];
    const defaultChaps = Array.from({ length: Math.min(5, mod.totalChapters) }, (_, i) => i + 1);
    setSelectedChapters(defaultChaps);
  };

  // Handle test type change
  const handleTestTypeChange = (type: 'standard' | 'chapter_wise') => {
    soundFx.playSelect();
    setTestType(type);
    if (type === 'standard') {
      setQuestionCount(100);
      setDurationMinutes(90);
    }
  };

  // Toggle single chapter
  const toggleChapter = (chapterNum: number) => {
    soundFx.playClick(550, 0.03);
    if (selectedChapters.includes(chapterNum)) {
      if (selectedChapters.length > 1) {
        setSelectedChapters(selectedChapters.filter((n) => n !== chapterNum));
      }
    } else {
      setSelectedChapters([...selectedChapters, chapterNum].sort((a, b) => a - b));
    }
  };

  // Quick preset: Select chapters 1 through 5
  const selectFirstFiveChapters = () => {
    soundFx.playClick(720, 0.04);
    const maxChaps = Math.min(5, activeModule.totalChapters);
    setSelectedChapters(Array.from({ length: maxChaps }, (_, i) => i + 1));
  };

  // Quick preset: Select remaining chapters (6 to end)
  const selectSecondHalfChapters = () => {
    soundFx.playClick(720, 0.04);
    if (activeModule.totalChapters > 5) {
      setSelectedChapters(Array.from({ length: activeModule.totalChapters - 5 }, (_, i) => i + 6));
    }
  };

  // Quick preset: Select all chapters
  const selectAllChapters = () => {
    soundFx.playClick(800, 0.04);
    setSelectedChapters(activeModule.chapters.map((c) => c.number));
  };

  // Apply Quick Exam Presets
  const applyPreset = (preset: 'standard_100' | 'rapid_50' | 'm1_tools' | 'm3_python') => {
    soundFx.playPreset();
    if (preset === 'standard_100') {
      setTestType('standard');
      setQuestionCount(100);
      setDurationMinutes(90);
      setBookletSeries('A');
    } else if (preset === 'rapid_50') {
      setTestType('chapter_wise');
      setQuestionCount(50);
      setDurationMinutes(45);
      selectFirstFiveChapters();
    } else if (preset === 'm1_tools') {
      setModuleId('M1');
      setTestType('standard');
      setQuestionCount(100);
      setDurationMinutes(90);
    } else if (preset === 'm3_python') {
      setModuleId('M3');
      setTestType('standard');
      setQuestionCount(100);
      setDurationMinutes(90);
    }
  };

  const buildConfig = (): TestConfiguration => {
    return {
      moduleId,
      testType,
      selectedChapters: testType === 'chapter_wise' ? selectedChapters : activeModule.chapters.map((c) => c.number),
      questionCount,
      durationMinutes,
      bookletSeries,
      candidateName: candidateName.trim() || 'Rahul Sharma',
      rollNumber: rollNumber.trim() || '240182749',
      sourceFilter,
      shuffleQuestions,
      shuffleOptions,
      includeAnswerKey,
      includeExplanations,
      includeOMRSheet
    };
  };

  const handleGenerateWithMode = (mode: 'cbt' | 'paper') => {
    soundFx.playSuccess();
    onGenerate(buildConfig(), mode);
  };

  // Calculations for live visual blueprint
  const effectiveChapters = testType === 'standard' ? activeModule.chapters.map((c) => c.number) : selectedChapters;
  const coveragePercent = Math.round((effectiveChapters.length / activeModule.totalChapters) * 100);
  const secondsPerQuestion = Math.round((durationMinutes * 60) / questionCount);

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative pb-32 md:pb-20">
      {/* Intro Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden"
      >
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Official NIELIT Exam Blueprint & Examjila Question Bank
            </span>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold">
              Revision 5.1 (R5.1)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            'O' Level Test Paper Generator
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Generate authentic examination papers for 
            <strong className="text-white"> M1 (IT Tools), M2 (Web Design), M3 (Python), and M4 (IoT)</strong>.
            Configure full standard mock papers (100 Qs / 90 Mins) or chapter-specific tests (e.g. Chapters 1 to 5) 
            with bilingual Hindi/English questions, verified answer keys, detailed explanations, and printable OMR sheets.
          </p>

          {/* Quick Battle Presets */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Quick Presets:
            </span>

            <button
              type="button"
              onClick={() => applyPreset('standard_100')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
            >
              <Target className="w-3 h-3 text-cyan-400" />
              <span>Full 100 Qs Mock</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('rapid_50')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Rapid 50 Qs (Ch 1-5)</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('m3_python')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
            >
              <span>🐍 Python M3 Drill</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('m1_tools')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
            >
              <span>💾 IT Tools M1 Drill</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-600/10 via-purple-600/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Main Configuration Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-8 backdrop-blur-sm"
      >
        {/* Step 1: Select O Level Module */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Select 'O' Level Module
              </h3>
            </div>

            {onOpenSyllabus && (
              <button
                type="button"
                onClick={onOpenSyllabus}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Full Syllabus</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {(['M1', 'M2', 'M3', 'M4'] as ModuleId[]).map((id) => {
              const mod = MODULES_INFO[id];
              const isSelected = moduleId === id;
              return (
                <motion.button
                  key={id}
                  id={`module-select-${id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModuleChange(id)}
                  type="button"
                  className={`text-left p-3 sm:p-4 rounded-2xl border-2 transition-all relative cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className={`text-[11px] sm:text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                      isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {mod.code}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">
                      {mod.totalChapters} Ch.
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug mb-0.5 sm:mb-1">
                    {mod.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-hindi line-clamp-1">
                    {mod.hindiTitle}
                  </p>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Test Format (Standard vs Chapter-Wise) */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Test Format & Chapter Scope
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            {/* Format Option A: Standard Full Mock */}
            <div
              onClick={() => handleTestTypeChange('standard')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                testType === 'standard'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  Standard NIELIT Mock Paper
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  100 Qs / 90 Mins
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Covers the entire syllabus across all {activeModule.totalChapters} chapters with official chapter weightages.
              </p>
            </div>

            {/* Format Option B: Chapter-Wise Test */}
            <div
              onClick={() => handleTestTypeChange('chapter_wise')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                testType === 'chapter_wise'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Custom Chapter-Wise Test
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  50 / 100 Qs
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Target specific chapters (e.g. <strong>Chapters 1 to 5</strong>) with 50 or 100 questions.
              </p>
            </div>
          </div>

          {/* If Chapter-Wise: Chapter Selection Grid */}
          {testType === 'chapter_wise' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4 mb-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Select Target Chapters ({selectedChapters.length} of {activeModule.totalChapters} Selected)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Click to include/exclude chapters from the test question pool.
                  </p>
                </div>

                {/* Quick Selection Presets */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={selectFirstFiveChapters}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-semibold text-slate-700 shadow-2xs cursor-pointer"
                  >
                    Chapters 1 to 5
                  </button>

                  {activeModule.totalChapters > 5 && (
                    <button
                      type="button"
                      onClick={selectSecondHalfChapters}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-semibold text-slate-700 shadow-2xs cursor-pointer"
                    >
                      Chapters 6 to {activeModule.totalChapters}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={selectAllChapters}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer ${
                      selectedChapters.length === activeModule.totalChapters
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700'
                    }`}
                  >
                    Select All ({activeModule.totalChapters})
                  </button>
                </div>
              </div>

              {/* Chapter Checkbox Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {activeModule.chapters.map((chap) => {
                  const isChecked = selectedChapters.includes(chap.number);
                  return (
                    <div
                      key={chap.number}
                      onClick={() => toggleChapter(chap.number)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-slate-900 mr-1.5">
                          Ch {chap.number}:
                        </span>
                        <span>{chap.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Length Selector for Chapter-Wise Test */}
              <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-4">
                <span className="text-xs font-bold text-slate-700">
                  Chapter Test Duration & Length:
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
                    <input
                      type="radio"
                      name="chapterLength"
                      checked={questionCount === 100 && durationMinutes === 90}
                      onChange={() => {
                        soundFx.playClick();
                        setQuestionCount(100);
                        setDurationMinutes(90);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>100 Questions (90 Minutes)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
                    <input
                      type="radio"
                      name="chapterLength"
                      checked={questionCount === 50 && durationMinutes === 45}
                      onChange={() => {
                        soundFx.playClick();
                        setQuestionCount(50);
                        setDurationMinutes(45);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>50 Questions (45 Minutes)</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Step 3: Question Sources & Booklet Customization */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Question Sources & Booklet Series
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Source filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Question Bank Sources:
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => {
                  soundFx.playClick();
                  setSourceFilter(e.target.value as any);
                }}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Sources (Examjila + NIELIT)</option>
                <option value="examjila">Examjila Mock Test Series</option>
                <option value="nielit_pyq">Official NIELIT PYQs (2023 - 2025)</option>
                <option value="nielit_model">Official NIELIT Model Papers</option>
              </select>
            </div>

            {/* Booklet Series */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Question Booklet Series:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['A', 'B', 'C', 'D'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setBookletSeries(s);
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      bookletSeries === s
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Name (Optional):
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number (Optional):
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 240182749"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Options Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Shuffle Questions</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(e) => setShuffleOptions(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Shuffle Options</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Include Answer Key</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={includeExplanations}
                onChange={(e) => setIncludeExplanations(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Bilingual Explanations</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={includeOMRSheet}
                onChange={(e) => setIncludeOMRSheet(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Printable OMR Sheet</span>
            </label>
          </div>
        </div>

        {/* Live Visual Blueprint & Metrics Gauge */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              Live Examination Blueprint & Analytics
            </span>
            <span className="text-xs font-mono text-slate-400">
              Target: {activeModule.code} (Series {bookletSeries})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Questions</span>
              <span className="text-xl font-bold font-mono text-white">{questionCount} Qs</span>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration & Pace</span>
              <span className="text-xl font-bold font-mono text-white">{durationMinutes}m ({secondsPerQuestion}s/Q)</span>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Syllabus Coverage</span>
              <span className="text-xl font-bold font-mono text-cyan-300">{coveragePercent}% ({effectiveChapters.length} Chaps)</span>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Negative Marking</span>
              <span className="text-xl font-bold font-mono text-emerald-400">0.0 (None)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Bottom Launch Action Bar */}
      <div className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-4xl z-30 no-print gpu-layer">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-2.5 sm:p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-white"
        >
          <div className="flex items-center gap-3 text-xs w-full sm:w-auto">
            {/* Authentic Module Logo Emblem */}
            {(() => {
              const modTheme = MODULE_THEMES[moduleId] || MODULE_THEMES.M1;
              const ModIcon = modTheme.icon;
              return (
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${modTheme.gradient} text-white shadow-lg border border-white/20 flex items-center justify-center shrink-0`}>
                    <ModIcon className="w-5 h-5 text-white drop-shadow-sm" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-black border ${modTheme.badgeBg} ${modTheme.badgeBorder} ${modTheme.badgeText} tracking-tight shrink-0 shadow-xs`}>
                        {activeModule.code}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono shrink-0 hidden sm:inline-block">
                        Series {bookletSeries}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-100 text-xs sm:text-sm truncate">
                <span className="truncate">{activeModule.title}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                {questionCount} Qs • {durationMinutes} Mins • {testType === 'standard' ? 'All 9 Chapters' : `${selectedChapters.length} Selected Ch.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              id="launch-cbt-btn"
              onClick={() => handleGenerateWithMode('cbt')}
              className="flex-1 sm:flex-none min-h-[42px] px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Launch CBT</span>
            </button>

            <button
              type="button"
              id="launch-paper-btn"
              onClick={() => handleGenerateWithMode('paper')}
              className="flex-1 sm:flex-none min-h-[42px] px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">Print Paper</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
