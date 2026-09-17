import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export const AmbientBackground: React.FC = () => {
  const { theme } = useTheme();

  // Deterministic star/particle positions for clean ambient floating
  const ambientParticles = useMemo(() => [
    { id: 1, top: '12%', left: '15%', size: 2, duration: '4s', delay: '0s' },
    { id: 2, top: '28%', left: '82%', size: 3, duration: '5s', delay: '1.2s' },
    { id: 3, top: '45%', left: '25%', size: 1.5, duration: '4.5s', delay: '2.1s' },
    { id: 4, top: '65%', left: '70%', size: 2.5, duration: '6s', delay: '0.8s' },
    { id: 5, top: '78%', left: '18%', size: 2, duration: '5.5s', delay: '3s' },
    { id: 6, top: '88%', left: '88%', size: 2, duration: '4s', delay: '1.5s' },
    { id: 7, top: '20%', left: '50%', size: 3, duration: '7s', delay: '2.5s' },
    { id: 8, top: '55%', left: '92%', size: 1.5, duration: '5s', delay: '0.5s' },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print transform-gpu gpu-layer" style={{ contain: 'strict' }}>
      {/* Top Aurora Glow */}
      <div 
        className={`absolute -top-32 left-1/4 w-[32rem] sm:w-[45rem] h-64 sm:h-96 rounded-full blur-2xl sm:blur-3xl opacity-20 transition-all duration-1000 gpu-layer ${
          theme === 'cyber-midnight' ? 'bg-gradient-to-r from-cyan-500/30 via-blue-600/25 to-purple-600/30' :
          theme === 'emerald-matrix' ? 'bg-gradient-to-r from-emerald-500/30 via-teal-600/25 to-cyan-600/30' :
          theme === 'royal-sunset' ? 'bg-gradient-to-r from-amber-500/30 via-rose-600/25 to-purple-600/30' :
          theme === 'neon-ruby' ? 'bg-gradient-to-r from-rose-500/35 via-pink-600/30 to-red-600/35' :
          theme === 'academic-gazette' ? 'bg-gradient-to-r from-blue-700/30 via-indigo-600/25 to-cyan-700/25' : 
          'bg-gradient-to-r from-indigo-500/30 via-purple-600/25 to-slate-800/30'
        }`}
      />

      {/* Dynamic Ambient Gradient Orbs with GPU acceleration */}
      <div 
        className={`absolute -top-40 -left-40 w-72 sm:w-[30rem] h-72 sm:h-[30rem] rounded-full blur-2xl sm:blur-3xl opacity-15 transition-all duration-1000 gpu-layer ${
          theme === 'cyber-midnight' ? 'bg-cyan-500/30' :
          theme === 'emerald-matrix' ? 'bg-emerald-500/30' :
          theme === 'royal-sunset' ? 'bg-amber-500/30' :
          theme === 'neon-ruby' ? 'bg-rose-500/35' :
          theme === 'academic-gazette' ? 'bg-blue-600/30' : 'bg-indigo-500/30'
        }`}
      />

      <div 
        className={`absolute top-1/3 -right-40 w-72 sm:w-[30rem] h-72 sm:h-[30rem] rounded-full blur-2xl sm:blur-3xl opacity-15 transition-all duration-1000 gpu-layer ${
          theme === 'cyber-midnight' ? 'bg-indigo-600/30' :
          theme === 'emerald-matrix' ? 'bg-teal-600/30' :
          theme === 'royal-sunset' ? 'bg-rose-600/30' :
          theme === 'neon-ruby' ? 'bg-pink-600/30' :
          theme === 'academic-gazette' ? 'bg-indigo-700/30' : 'bg-purple-600/30'
        }`}
      />

      <div 
        className={`hidden sm:block absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-15 transition-all duration-1000 gpu-layer ${
          theme === 'cyber-midnight' ? 'bg-blue-600/25' :
          theme === 'emerald-matrix' ? 'bg-emerald-600/25' :
          theme === 'royal-sunset' ? 'bg-orange-600/25' :
          theme === 'neon-ruby' ? 'bg-red-600/30' :
          theme === 'academic-gazette' ? 'bg-blue-800/25' : 'bg-violet-600/25'
        }`}
      />

      {/* Stardust Ambient Glowing Particles */}
      {ambientParticles.map((p) => (
        <div
          key={p.id}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `pulse ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay
          }}
          className={`absolute rounded-full pointer-events-none transition-colors duration-500 ${
            theme === 'emerald-matrix' ? 'bg-emerald-300' :
            theme === 'royal-sunset' ? 'bg-amber-300' :
            theme === 'neon-ruby' ? 'bg-rose-300' :
            'bg-cyan-300'
          }`}
        />
      ))}

      {/* Matrix / Geometric Micro Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
