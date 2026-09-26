import React, { useState } from 'react';
import { ALCHEMIST_LEVELS } from '../../utils/mathHelpers';
import { AlchemistLevel } from '../../types/math';
import { playSound } from '../../utils/audio';
import { Sparkles, RefreshCw, CheckCircle2, ChevronRight, Zap, Plus, Minus } from 'lucide-react';

export const ZeroPairPuzzleGame: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const currentLevel: AlchemistLevel = ALCHEMIST_LEVELS[levelIndex];

  const [positives, setPositives] = useState<number>(currentLevel.initialPositives);
  const [negatives, setNegatives] = useState<number>(currentLevel.initialNegatives);
  const [pairedCount, setPairedCount] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const netCharge = positives - negatives;

  const handlePairCharges = () => {
    if (positives <= 0 || negatives <= 0) {
      playSound('thud');
      return;
    }
    playSound('pop');
    setPositives((p) => p - 1);
    setNegatives((n) => n - 1);
    setPairedCount((pc) => pc + 1);

    checkWinCondition(positives - 1 - (negatives - 1));
  };

  const handleAddZeroPair = () => {
    if (!currentLevel.allowAddZeroPair) return;
    playSound('pop');
    setPositives((p) => p + 1);
    setNegatives((n) => n + 1);
  };

  const handleRemovePositive = () => {
    if (!currentLevel.allowRemovePositives || positives <= 0) return;
    playSound('whoosh');
    const nextPos = positives - 1;
    setPositives(nextPos);
    checkWinCondition(nextPos - negatives);
  };

  const handleRemoveNegative = () => {
    if (!currentLevel.allowRemoveNegatives || negatives <= 0) return;
    playSound('whoosh');
    const nextNeg = negatives - 1;
    setNegatives(nextNeg);
    checkWinCondition(positives - nextNeg);
  };

  const checkWinCondition = (calculatedNet: number) => {
    if (calculatedNet === currentLevel.targetNetCharge) {
      playSound('victory');
      setIsSuccess(true);
      if (!completedLevels.includes(currentLevel.id)) {
        setCompletedLevels((prev) => [...prev, currentLevel.id]);
      }
    }
  };

  const handleResetLevel = () => {
    playSound('whoosh');
    setPositives(currentLevel.initialPositives);
    setNegatives(currentLevel.initialNegatives);
    setPairedCount(0);
    setIsSuccess(false);
  };

  const handleNextLevel = () => {
    if (levelIndex < ALCHEMIST_LEVELS.length - 1) {
      const nextIdx = levelIndex + 1;
      setLevelIndex(nextIdx);
      const nextLvl = ALCHEMIST_LEVELS[nextIdx];
      setPositives(nextLvl.initialPositives);
      setNegatives(nextLvl.initialNegatives);
      setPairedCount(0);
      setIsSuccess(false);
      playSound('whoosh');
    }
  };

  const selectLevelDirectly = (idx: number) => {
    setLevelIndex(idx);
    const lvl = ALCHEMIST_LEVELS[idx];
    setPositives(lvl.initialPositives);
    setNegatives(lvl.initialNegatives);
    setPairedCount(0);
    setIsSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <span>GAME 2</span>
              <span>·</span>
              <span>ZERO-PAIR ALCHEMIST</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">The Charge Crucible</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Transmute the atomic charges to reach the exact target net balance. Form zero pairs, introduce neutral catalysts, or extract opposing ions!
            </p>
          </div>

          {/* Level selector buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/50">
            {ALCHEMIST_LEVELS.map((lvl, idx) => {
              const isCurrent = idx === levelIndex;
              const isDone = completedLevels.includes(lvl.id);
              return (
                <button
                  key={lvl.id}
                  onClick={() => selectLevelDirectly(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : isDone
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={lvl.title}
                >
                  {isDone ? '✓' : idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Arena (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Mission Objective Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-amber-400">LEVEL {currentLevel.id}: {currentLevel.title}</span>
                <p className="text-xs text-slate-300 mt-1">{currentLevel.instruction}</p>
              </div>
              <button
                onClick={handleResetLevel}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Reset Crucible"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Token Crucible Tray */}
            <div className="mt-6">
              <div className="text-xs text-slate-400 mb-2 flex justify-between">
                <span>ACTIVE CHARGE PARTICLES</span>
                <span className="font-mono text-slate-300">{positives} Pos · {negatives} Neg</span>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 min-h-[220px] flex flex-wrap gap-2.5 items-center content-start">
                {/* Positives */}
                {Array.from({ length: positives }).map((_, i) => (
                  <div
                    key={`p-${i}`}
                    className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 font-bold font-mono text-sm flex items-center justify-center shadow-lg shadow-amber-400/20 border-2 border-amber-300 select-none animate-in fade-in"
                  >
                    +1
                  </div>
                ))}

                {/* Negatives */}
                {Array.from({ length: negatives }).map((_, i) => (
                  <div
                    key={`n-${i}`}
                    className="w-11 h-11 rounded-full bg-rose-600 text-white font-bold font-mono text-sm flex items-center justify-center shadow-lg shadow-rose-600/20 border-2 border-rose-400 select-none animate-in fade-in"
                  >
                    -1
                  </div>
                ))}

                {positives === 0 && negatives === 0 && (
                  <div className="w-full text-center py-10 text-xs text-slate-500">
                    Crucible is empty (Neutral 0)
                  </div>
                )}
              </div>

              {/* Paired count footnote */}
              {pairedCount > 0 && (
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pairedCount} zero pair(s) neutralized and dissolved.</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <button
              onClick={handlePairCharges}
              disabled={positives <= 0 || negatives <= 0 || isSuccess}
              className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Neutralize Pair (+ and -)</span>
            </button>

            {currentLevel.allowAddZeroPair && (
              <button
                onClick={handleAddZeroPair}
                disabled={isSuccess}
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Zero Pair (+/-)</span>
              </button>
            )}

            {currentLevel.allowRemoveNegatives && (
              <button
                onClick={handleRemoveNegative}
                disabled={negatives <= 0 || isSuccess}
                className="px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 disabled:opacity-40 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Remove Neg (-1)</span>
              </button>
            )}

            {currentLevel.allowRemovePositives && (
              <button
                onClick={handleRemovePositive}
                disabled={positives <= 0 || isSuccess}
                className="px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-600/40 disabled:opacity-40 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Remove Pos (+1)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Status & Win Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Gauge */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider">CRUCIBLE TELEMETRY</h3>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CURRENT NET</span>
                <span
                  className={`text-3xl font-extrabold font-mono tabular-nums ${
                    netCharge > 0 ? 'text-amber-400' : netCharge < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {netCharge > 0 ? `+${netCharge}` : netCharge}
                </span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block font-bold">TARGET NET</span>
                <span className="text-3xl font-extrabold font-mono text-emerald-300 tabular-nums">
                  {currentLevel.targetNetCharge > 0 ? `+${currentLevel.targetNetCharge}` : currentLevel.targetNetCharge}
                </span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <strong className="text-amber-300 block mb-1">Concept In Action:</strong>
              {currentLevel.storyExplanation}
            </div>
          </div>

          {/* Victory Modal */}
          {isSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-2xl p-6 text-emerald-100 shadow-xl">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Target Reached! Master Alchemist!</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    Charge stabilized at {currentLevel.targetNetCharge}!
                  </p>
                </div>
              </div>
              {levelIndex < ALCHEMIST_LEVELS.length - 1 ? (
                <button
                  onClick={handleNextLevel}
                  className="mt-4 w-full py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <span>Advance to Level {levelIndex + 2}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="mt-3 text-xs font-bold text-amber-300">
                  🎉 All Alchemist Levels Mastered!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
