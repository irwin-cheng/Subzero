import React from 'react';
import { ActiveGame } from '../../types/math';
import { SubmarineRescueGame } from './SubmarineRescueGame';
import { ZeroPairPuzzleGame } from './ZeroPairPuzzleGame';
import { StreakArenaGame } from './StreakArenaGame';
import { EquationMatrixGame } from './EquationMatrixGame';

interface GamesHubProps {
  activeGame: ActiveGame;
  setActiveGame: (game: ActiveGame) => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ activeGame, setActiveGame }) => {
  const games: { id: ActiveGame; title: string; icon: string }[] = [
    { id: 'rescue', title: 'Sub Rescue (8 Missions)', icon: '🚢' },
    { id: 'alchemist', title: 'Zero-Pair Crucible', icon: '⚡' },
    { id: 'streak', title: 'Speed Streak Arena', icon: '🔥' },
    { id: 'matrix', title: 'Equation Matrix (KenKen)', icon: '🔢' },
  ];

  return (
    <div className="space-y-6">
      {/* Game Mode Tab Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {games.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.title}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Game */}
      {activeGame === 'rescue' && <SubmarineRescueGame />}
      {activeGame === 'alchemist' && <ZeroPairPuzzleGame />}
      {activeGame === 'streak' && <StreakArenaGame />}
      {activeGame === 'matrix' && <EquationMatrixGame />}
    </div>
  );
};
