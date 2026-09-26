import React from 'react';
import { Volume2, VolumeX, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types/math';
import { getIsMuted, setMuted } from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenRules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenRules }) => {
  const [muted, setMutedState] = React.useState(getIsMuted());

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'overview', label: 'Labs Overview' },
    { id: 'counters', label: 'Zero Pairs' },
    { id: 'submarine', label: 'Submarine & Altitude' },
    { id: 'numberline', label: 'Number Line Rover' },
    { id: 'patterns', label: 'Pattern Matrix' },
    { id: 'games', label: 'Game Puzzles' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-left group flex items-center gap-2"
        >
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
            SubZero<span className="text-amber-400">Lab</span>
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={muted ? 'Sound muted' : 'Sound enabled'}
          >
            {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenRules}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Rules Cheat Sheet</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-amber-400 text-slate-900 font-semibold'
                : 'text-slate-300 bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
