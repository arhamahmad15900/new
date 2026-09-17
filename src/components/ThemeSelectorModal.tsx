import React from 'react';
import { useTheme, THEMES, AppTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Volume2, VolumeX, Palette } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, soundEnabled, setSoundEnabled } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Personalize Theme & UI Experience
                </h3>
                <p className="text-xs text-slate-400">
                  Select your aesthetic colorway and interactive audio preferences.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 gap-2.5 py-5">
            {(Object.keys(THEMES) as AppTheme[]).map((themeKey) => {
              const item = THEMES[themeKey];
              const isSelected = theme === themeKey;

              return (
                <motion.button
                  key={themeKey}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setTheme(themeKey);
                    soundFx.playSelect();
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400/60 ring-2 ring-cyan-500/20 shadow-lg'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Swatch preview */}
                    <div 
                      className="w-4 h-4 rounded-full shadow-inner border border-white/30"
                      style={{ backgroundColor: item.accentColor }}
                    />
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold' : 'border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Sound Toggle */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-xs font-semibold text-slate-300">
                Micro-interaction UI Sound Effects
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                soundFx.enabled = next;
                if (next) soundFx.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {soundEnabled ? 'Enabled (ON)' : 'Muted (OFF)'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
