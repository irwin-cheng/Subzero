import React, { useState } from 'react';
import { ActiveTab, ActiveGame } from '../types/math';
import { ArrowRight, Sparkles, Compass, Footprints, Grid3X3, Gamepad2, Award, Zap, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

// Local asset generated in earlier step
import heroMarineImg from '../assets/images/hero_subzero_marine_1790391057269.jpg';
import balloonImg from '../assets/images/balloon_altitude_lab_1790391065820.jpg';

interface OverviewHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectGame: (game: ActiveGame) => void;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({ setActiveTab, onSelectGame }) => {
  const [quickAnswer, setQuickAnswer] = useState<number | null>(null);
  const [quickFeedback, setQuickFeedback] = useState<string | null>(null);

  const handleQuickQuiz = (choice: number) => {
    setQuickAnswer(choice);
    if (choice === 8) {
      playSound('chime');
      setQuickFeedback('Correct! 5 - (-3) = 5 + 3 = 8! Subtracting a negative turns into adding positive!');
    } else {
      playSound('thud');
      setQuickFeedback('Not quite! Remember: subtracting a negative means removing debt, which makes your total INCREASE (+)! 5 - (-3) = 8.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text Zone (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>MIDDLE SCHOOL CONCEPTUAL MASTERY</span>
              <span>·</span>
              <span>GRADE 6-8 COMMON CORE 7.NS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight text-balance leading-tight">
              Negative Numbers Made <span className="text-amber-400">Tactile & Fun</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Stop memorizing confusing rules like "two minuses make a plus" without knowing why.
              Explore interactive zero-pair counters, deep-sea submarine physics, the number line rover, and gamified rescue missions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('counters')}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-400/20 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Explore Zero-Pair Lab</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('games');
                  onSelectGame('rescue');
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-md shadow-cyan-600/20 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Play Sub Rescue Game</span>
              </button>
            </div>
          </div>

          {/* Right Visual Image (5 cols) with Zero-Broken-Image fallback */}
          <div className="lg:col-span-5 h-64 lg:h-96 relative overflow-hidden bg-slate-950">
            <img
              src={heroMarineImg}
              alt="Research submarine navigating negative depth markers underwater"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                // Resilient CSS Fallback container if load fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick Interactive Warm-Up Puzzle Widget */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>INSTANT WARM-UP RIDDLE</span>
            </div>
            <h3 className="text-lg font-bold text-white">Can you solve: 5 − (−3) = ?</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select what happens when you subtract 3 negative units from 5 positives:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[2, -2, 8, -8].map((choice) => (
              <button
                key={choice}
                onClick={() => handleQuickQuiz(choice)}
                className={`w-14 h-11 rounded-xl font-mono text-base font-bold transition-all cursor-pointer ${
                  quickAnswer === choice
                    ? choice === 8
                      ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                      : 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {choice > 0 ? `+${choice}` : choice}
              </button>
            ))}
          </div>
        </div>

        {quickFeedback && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed flex items-center gap-2.5 ${
              quickAnswer === 8
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}
          >
            {quickAnswer === 8 ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{quickFeedback}</span>
          </div>
        )}
      </div>

      {/* 4 Interactive Visual Labs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">4 Interactive Concept Laboratories</h2>
            <p className="text-xs text-slate-400">Step-by-step physical models that make negative numbers intuitive</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Counters */}
          <div
            onClick={() => setActiveTab('counters')}
            className="group bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                The Zero-Pair Lab
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Matter and antimatter for numbers! Combine yellow (+) and red (-) chips to neutralize into 0.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span>Open Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Submarine */}
          <div
            onClick={() => setActiveTab('submarine')}
            className="group bg-slate-900 border border-slate-800 hover:border-cyan-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                Submarine & Altitude
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Sea level is 0. Helium bags lift you up (+), sandbags drag you down (-). Cut sandbags to ascend!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Open Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Number Line */}
          <div
            onClick={() => setActiveTab('numberline')}
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Footprints className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                Number Line Rover
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Watch the Rover turn around for subtraction and walk backward for negatives, ending up positive!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Open Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Pattern Matrix */}
          <div
            onClick={() => setActiveTab('patterns')}
            className="group bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Grid3X3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                The Pattern Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                The mathematical staircase proving why (-) × (-) must equal (+) to preserve logical patterns.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span>Open Lab</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Puzzle Modes Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">4 Gamified Math Puzzles</h2>
            <p className="text-xs text-slate-400">Put concepts into action with real challenges and missions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Game 1: Sub Rescue */}
          <div
            onClick={() => {
              setActiveTab('games');
              onSelectGame('rescue');
            }}
            className="group bg-slate-900 border border-slate-800 hover:border-cyan-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xl shrink-0">
                🚢
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                  Deep Sea Submarine Rescue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  8 tactical depth missions: apply ballast operations to dock at exact coordinates before fuel runs out.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Game 2: Alchemist */}
          <div
            onClick={() => {
              setActiveTab('games');
              onSelectGame('alchemist');
            }}
            className="group bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                  The Zero-Pair Alchemist
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Crucible charge puzzles: add neutral catalysts, form pairs, and extract negative debt to balance the charges.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Game 3: Matrix Grid */}
          <div
            onClick={() => {
              setActiveTab('games');
              onSelectGame('matrix');
            }}
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-xl shrink-0">
                🔢
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                  Negative Equation Matrix (KenKen)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill intersecting rows and columns so all target signed products and sums validate correctly.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Game 4: Streak Arena */}
          <div
            onClick={() => {
              setActiveTab('games');
              onSelectGame('streak');
            }}
            className="group bg-slate-900 border border-slate-800 hover:border-rose-400/60 rounded-2xl p-5 transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center text-xl shrink-0">
                🔥
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-rose-400 transition-colors">
                  Speed Streak Arena
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  60-second procedural challenge with combo multipliers and instant misconception breakdown popups.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-400 shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
