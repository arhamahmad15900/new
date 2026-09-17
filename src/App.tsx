import React, { useState } from 'react';
import { Header } from './components/Header';
import { TestConfigForm } from './components/TestConfigForm';
import { PrintableTestPaper } from './components/PrintableTestPaper';
import { CBTSimulator } from './components/CBTSimulator';
import { PdfReasoningStudio } from './components/PdfReasoningStudio';
import { HostAndJoinTestPage } from './components/HostAndJoinTest/HostAndJoinTestPage';
import { SyllabusDrawerModal } from './components/SyllabusDrawerModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AmbientBackground } from './components/AmbientBackground';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TestConfiguration, GeneratedTest, ModuleId } from './types';
import { generateTestPaper } from './data/testGenerator';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_CONFIG: TestConfiguration = {
  moduleId: 'M1',
  testType: 'standard',
  selectedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  questionCount: 100,
  durationMinutes: 90,
  bookletSeries: 'A',
  candidateName: 'Rahul Sharma',
  rollNumber: '240182749',
  sourceFilter: 'all',
  shuffleQuestions: false,
  shuffleOptions: false,
  includeAnswerKey: true,
  includeExplanations: true,
  includeOMRSheet: true
};

function MainApp() {
  const { themeConfig, theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'generator' | 'paper' | 'cbt' | 'pdf_reasoning' | 'host_join'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('join') || params.get('testId')) return 'host_join';
    }
    return 'generator'; // Default to Generator page on initial visit
  });
  const [currentConfig, setCurrentConfig] = useState<TestConfiguration>(DEFAULT_CONFIG);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  
  // Memoized initial test generation
  const [currentTest, setCurrentTest] = useState<GeneratedTest>(() => {
    return generateTestPaper(DEFAULT_CONFIG);
  });

  const handleLaunchCustomTest = (test: GeneratedTest, mode: 'cbt' | 'paper') => {
    setCurrentTest(test);
    setCurrentConfig(test.config);
    setActiveTab(mode);
  };

  const handleGenerate = (config: TestConfiguration, mode: 'cbt' | 'paper' = 'cbt') => {
    setCurrentConfig(config);
    const newTest = generateTestPaper(config);
    setCurrentTest(newTest);
    setActiveTab(mode === 'cbt' ? 'cbt' : 'paper');
  };

  const handleSelectChapterFromSyllabus = (chapNum: number) => {
    setCurrentConfig((prev) => ({
      ...prev,
      testType: 'chapter_wise',
      selectedChapters: [chapNum]
    }));
    setActiveTab('generator');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.bgGradient} text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black relative transition-colors duration-500`}>
      {/* Dynamic Ambient Particle/Glow Background */}
      <AmbientBackground />

      {/* Top Header & Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSyllabus={() => setIsSyllabusOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-32 sm:pb-20 relative z-10">
        {/* Persistent Main Workspace Tabs (Preserves active generation, PDF notes, and live server state) */}
        <div className={activeTab === 'generator' ? 'block' : 'hidden'}>
          <TestConfigForm 
            onGenerate={handleGenerate} 
            initialConfig={currentConfig} 
            onOpenSyllabus={() => setIsSyllabusOpen(true)}
          />
        </div>

        <div className={activeTab === 'pdf_reasoning' ? 'block' : 'hidden'}>
          <PdfReasoningStudio 
            onLaunchTest={handleLaunchCustomTest}
          />
        </div>

        <div className={activeTab === 'host_join' ? 'block' : 'hidden'}>
          <HostAndJoinTestPage />
        </div>

        {/* Modal-like Test Execution Views */}
        <AnimatePresence>
          {activeTab === 'cbt' && currentTest && (
            <motion.div
              key="cbt"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <CBTSimulator 
                test={currentTest}
                onExit={() => setActiveTab('generator')}
                onSwitchToPaper={() => setActiveTab('paper')}
              />
            </motion.div>
          )}

          {activeTab === 'paper' && currentTest && (
            <motion.div
              key="paper"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <PrintableTestPaper 
                test={currentTest} 
                onReconfigure={() => setActiveTab('generator')}
                onSwitchToCBT={() => setActiveTab('cbt')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Syllabus Drawer Modal */}
      <SyllabusDrawerModal
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        initialModuleId={currentConfig.moduleId}
        onSelectChapter={handleSelectChapterFromSyllabus}
      />

      {/* Mobile Floating Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSyllabus={() => setIsSyllabusOpen(true)}
      />

      {/* Footer (Hidden in Print) */}
      <footer className="no-print bg-slate-950/95 backdrop-blur-md text-slate-400 text-xs py-8 border-t border-slate-800/80 mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <p className="font-bold text-sm text-slate-200">
                  NIELIT 'O' Level Examination Question Paper Generator
                </p>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  R5.1 Aligned
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-xl">
                Comprehensive test generator &amp; interactive CBT simulator for NIELIT M1, M2, M3, and M4 modules.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span>Author:</span>
                <span className="text-cyan-300 font-bold text-sm">Arham Ahmad Khan</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Copyright &copy; {new Date().getFullYear()} <strong className="text-slate-200 font-semibold">Arham Ahmad Khan</strong>. All Rights Reserved.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-slate-300">M1: IT Tools</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-300">M2: Web Design</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-300">M3: Python</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-300">M4: IoT</span>
            </div>
            <div className="text-slate-400 text-center">
              Designed &amp; Developed by <strong className="text-cyan-400 font-medium">Arham Ahmad Khan</strong>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
