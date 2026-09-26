/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, ActiveGame } from './types/math';
import { Navbar } from './components/Navbar';
import { RulesCheatSheetModal } from './components/RulesCheatSheetModal';
import { OverviewHero } from './components/OverviewHero';
import { ZeroPairLab } from './components/labs/ZeroPairLab';
import { SubmarineLab } from './components/labs/SubmarineLab';
import { NumberLineLab } from './components/labs/NumberLineLab';
import { PatternMatrixLab } from './components/labs/PatternMatrixLab';
import { UniversalEquationExplainer } from './components/labs/UniversalEquationExplainer';
import { GamesHub } from './components/games/GamesHub';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [activeGame, setActiveGame] = useState<ActiveGame>('rescue');
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  const handleSelectGame = (game: ActiveGame) => {
    setActiveGame(game);
    setActiveTab('games');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Rules Cheat Sheet Modal */}
      <RulesCheatSheetModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <OverviewHero
              setActiveTab={setActiveTab}
              onSelectGame={handleSelectGame}
            />
            <UniversalEquationExplainer />
          </div>
        )}

        {activeTab === 'counters' && <ZeroPairLab />}

        {activeTab === 'submarine' && <SubmarineLab />}

        {activeTab === 'numberline' && <NumberLineLab />}

        {activeTab === 'patterns' && <PatternMatrixLab />}

        {activeTab === 'games' && (
          <GamesHub
            activeGame={activeGame}
            setActiveGame={setActiveGame}
          />
        )}
      </main>

      {/* Educational Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-400">SubZero Lab</span>
            <span>·</span>
            <span>Middle School Mathematics (Grade 6–8 · CCSS.MATH.CONTENT.7.NS.A.1 & A.2)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Sign Rules Guide
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('counters')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Zero-Pair Workshop
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setActiveTab('games');
                setActiveGame('streak');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Speed Arena
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
