import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 
  | 'cyber-midnight' 
  | 'emerald-matrix' 
  | 'royal-sunset' 
  | 'academic-gazette' 
  | 'neon-ruby'
  | 'minimal-titanium';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  cardBg: string;
  heroGradient: string;
  buttonGradient: string;
  badgeBg: string;
  borderGlow: string;
  icon: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  'cyber-midnight': {
    id: 'cyber-midnight',
    name: 'Neo-Cyber Luxe',
    tagline: 'Deep Obsidian Slate & Electric Cyan-Violet Aura',
    accentColor: '#06b6d4',
    bgGradient: 'from-slate-950 via-[#0b0f19] to-[#0f172a]',
    cardBg: 'bg-slate-900/90 backdrop-blur-xl border-slate-800/80 text-white shadow-xl',
    heroGradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    buttonGradient: 'from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/25',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
    borderGlow: 'border-cyan-500/30 ring-1 ring-cyan-500/20',
    icon: '✨'
  },
  'emerald-matrix': {
    id: 'emerald-matrix',
    name: 'Quantum Emerald',
    tagline: 'Dark Navy Obsidian & Luminous Mint Glow',
    accentColor: '#10b981',
    bgGradient: 'from-slate-950 via-[#061a14] to-[#022c22]',
    cardBg: 'bg-zinc-900/90 backdrop-blur-xl border-emerald-900/50 text-white shadow-xl',
    heroGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    buttonGradient: 'from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    borderGlow: 'border-emerald-500/30 ring-1 ring-emerald-500/20',
    icon: '⚡'
  },
  'royal-sunset': {
    id: 'royal-sunset',
    name: 'Sunset Aurora',
    tagline: 'Midnight Velvet & Radiant Amber-Rose Spark',
    accentColor: '#f59e0b',
    bgGradient: 'from-slate-950 via-[#180d1e] to-[#250d18]',
    cardBg: 'bg-stone-900/90 backdrop-blur-xl border-amber-900/40 text-white shadow-xl',
    heroGradient: 'from-amber-500 via-orange-600 to-rose-600',
    buttonGradient: 'from-amber-500 via-orange-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-amber-500/25',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    borderGlow: 'border-amber-500/30 ring-1 ring-amber-500/20',
    icon: '🌅'
  },
  'neon-ruby': {
    id: 'neon-ruby',
    name: 'Obsidian Crimson',
    tagline: 'Stealth Matte Black & Vivid Neon Rose Flame',
    accentColor: '#f43f5e',
    bgGradient: 'from-[#0a0a0f] via-[#150a10] to-[#1f0b14]',
    cardBg: 'bg-[#121118]/90 backdrop-blur-xl border-rose-900/40 text-white shadow-xl',
    heroGradient: 'from-rose-500 via-pink-600 to-red-600',
    buttonGradient: 'from-rose-500 via-pink-600 to-red-600 hover:from-rose-400 hover:to-pink-500 shadow-rose-500/25',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
    borderGlow: 'border-rose-500/30 ring-1 ring-rose-500/20',
    icon: '🔥'
  },
  'academic-gazette': {
    id: 'academic-gazette',
    name: 'Royal Cobalt & Sapphire',
    tagline: 'Prestigious Deep Blue & High-Contrast Electric Azure',
    accentColor: '#3b82f6',
    bgGradient: 'from-slate-950 via-[#071329] to-[#0a1e3f]',
    cardBg: 'bg-slate-900/90 backdrop-blur-xl border-blue-900/50 text-white shadow-xl',
    heroGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
    buttonGradient: 'from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-blue-500/25',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
    borderGlow: 'border-blue-500/30 ring-1 ring-blue-500/20',
    icon: '🏛️'
  },
  'minimal-titanium': {
    id: 'minimal-titanium',
    name: 'Titanium Graphite',
    tagline: 'Ultra-Clean Monochromatic Dark Slate & Violet Accent',
    accentColor: '#818cf8',
    bgGradient: 'from-[#0b0c10] via-[#12141d] to-[#161926]',
    cardBg: 'bg-[#161822]/90 backdrop-blur-xl border-slate-700/50 text-white shadow-xl',
    heroGradient: 'from-indigo-500 via-purple-600 to-slate-700',
    buttonGradient: 'from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 shadow-indigo-500/25',
    badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30',
    borderGlow: 'border-indigo-500/30 ring-1 ring-indigo-500/20',
    icon: '💎'
  }
};

interface ThemeContextType {
  theme: AppTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AppTheme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nielit_app_theme') as AppTheme;
      if (saved && THEMES[saved]) return saved;
    }
    return 'cyber-midnight';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nielit_app_sound');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nielit_app_theme', newTheme);
    }
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nielit_app_sound', String(enabled));
    }
  };

  return (
    <ThemeContext.Provider 
      value={{
        theme,
        themeConfig: THEMES[theme],
        setTheme,
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
