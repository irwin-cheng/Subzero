import React, { useState } from 'react';
import { SUBMARINE_MISSIONS } from '../../utils/mathHelpers';
import { SubmarineMission, Operation } from '../../types/math';
import { playSound } from '../../utils/audio';
import { Compass, RotateCcw, Award, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';

export const SubmarineRescueGame: React.FC = () => {
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const currentMission: SubmarineMission = SUBMARINE_MISSIONS[missionIndex];

  const [currentDepth, setCurrentDepth] = useState<number>(currentMission.startingDepth);
  const [appliedCards, setAppliedCards] = useState<{ id: string; label: string; op: Operation; val: number; resultDepth: number }[]>([]);
  const [usedCardIds, setUsedCardIds] = useState<Set<string>>(new Set());
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [missionsCompleted, setMissionsCompleted] = useState<number[]>([]);

  const fuelLeft = currentMission.fuelLimit - appliedCards.length;

  const handleApplyCard = (card: { id: string; label: string; operation: Operation; value: number }) => {
    if (usedCardIds.has(card.id) || fuelLeft <= 0 || isSuccess) return;

    let newDepth = currentDepth;
    if (card.operation === '+') newDepth = currentDepth + card.value;
    else if (card.operation === '-') newDepth = currentDepth - card.value;
    else if (card.operation === '×') newDepth = currentDepth * card.value;
    else if (card.operation === '÷' && card.value !== 0) newDepth = Math.round(currentDepth / card.value);

    playSound('sonar');
    setCurrentDepth(newDepth);
    setUsedCardIds((prev) => new Set(prev).add(card.id));
    setAppliedCards((prev) => [
      ...prev,
      { id: card.id, label: card.label, op: card.operation, val: card.value, resultDepth: newDepth },
    ]);

    // Check win condition
    if (newDepth === currentMission.targetDepth) {
      playSound('victory');
      setIsSuccess(true);
      if (!missionsCompleted.includes(currentMission.id)) {
        setMissionsCompleted((prev) => [...prev, currentMission.id]);
      }
    } else if (fuelLeft - 1 <= 0) {
      playSound('thud');
    }
  };

  const handleResetMission = () => {
    playSound('whoosh');
    setCurrentDepth(currentMission.startingDepth);
    setAppliedCards([]);
    setUsedCardIds(new Set());
    setIsSuccess(false);
    setShowHint(false);
  };

  const handleNextMission = () => {
    if (missionIndex < SUBMARINE_MISSIONS.length - 1) {
      const nextIdx = missionIndex + 1;
      setMissionIndex(nextIdx);
      const nextMission = SUBMARINE_MISSIONS[nextIdx];
      setCurrentDepth(nextMission.startingDepth);
      setAppliedCards([]);
      setUsedCardIds(new Set());
      setIsSuccess(false);
      setShowHint(false);
      playSound('whoosh');
    }
  };

  const selectMissionDirectly = (idx: number) => {
    setMissionIndex(idx);
    const m = SUBMARINE_MISSIONS[idx];
    setCurrentDepth(m.startingDepth);
    setAppliedCards([]);
    setUsedCardIds(new Set());
    setIsSuccess(false);
    setShowHint(false);
  };

  // Convert depth to percentage: min -55m, max +25m (span 80m)
  const getDepthPercentage = (depth: number) => {
    return Math.max(0, Math.min(100, ((25 - depth) / 80) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Header and Mission Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <span>GAME 1</span>
              <span>·</span>
              <span>TACTICAL DEPTH NAVIGATION</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">Submarine Deep Dive Rescue</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Navigate the submersible through ocean trenches and aerial docks. Select operation cards in sequence to hit the target coordinate before fuel expires!
            </p>
          </div>

          {/* Level chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-800/80 rounded-xl border border-slate-700/50">
            {SUBMARINE_MISSIONS.map((m, idx) => {
              const isCurrent = idx === missionIndex;
              const isDone = missionsCompleted.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => selectMissionDirectly(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950 shadow-md ring-2 ring-cyan-300'
                      : isDone
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={m.title}
                >
                  {isDone ? '✓' : idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Ocean & Vessel Track (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[500px]">
          {/* Depth background gradient */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="h-[31.25%] bg-gradient-to-b from-sky-900/60 to-cyan-900/40 border-b border-cyan-500/30" />
            <div className="h-[25%] bg-gradient-to-b from-cyan-950/80 to-blue-950/90 border-b border-blue-500/30" />
            <div className="h-[43.75%] bg-gradient-to-b from-blue-950 to-slate-950" />
          </div>

          {/* Sea level 0m line */}
          <div
            className="absolute left-0 right-0 z-10 flex items-center px-4 pointer-events-none"
            style={{ top: '31.25%' }}
          >
            <div className="w-full border-t border-dashed border-cyan-400/80 flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/40">
                0m SEA LEVEL
              </span>
            </div>
          </div>

          {/* Target Zone Marker */}
          <div
            className="absolute left-14 right-4 z-10 border-2 border-emerald-400 bg-emerald-500/15 rounded-xl p-2 flex items-center justify-between pointer-events-none transition-all"
            style={{
              top: `${getDepthPercentage(currentMission.targetDepth)}%`,
              transform: 'translateY(-50%)',
            }}
          >
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>TARGET OBJECTIVE: {currentMission.targetDepth > 0 ? `+${currentMission.targetDepth}m` : `${currentMission.targetDepth}m`}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-slate-950">
              DOCK HERE
            </span>
          </div>

          {/* Submarine Vessel */}
          <div className="relative h-full mx-14 my-4">
            <div
              className="absolute left-0 right-0 transition-all duration-500 ease-out z-20 flex flex-col items-center"
              style={{
                top: `${getDepthPercentage(currentDepth)}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <div
                className={`p-2.5 rounded-2xl border shadow-2xl flex items-center gap-2.5 ${
                  isSuccess
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-4 ring-emerald-500/20'
                    : 'bg-cyan-900/60 border-cyan-400 text-white'
                }`}
              >
                <span className="text-xl">{currentDepth >= 0 ? '🚁' : '🚢'}</span>
                <div>
                  <div className="text-xs font-bold font-mono">
                    Depth: {currentDepth > 0 ? `+${currentDepth}m` : `${currentDepth}m`}
                  </div>
                  <div className="text-[10px] text-cyan-300">Nautilus-X1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Depth status bar */}
          <div className="z-10 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300">Current Depth:</span>
            </div>
            <span className="font-mono font-bold text-sm text-cyan-300">
              {currentDepth > 0 ? `+${currentDepth}m` : `${currentDepth}m`}
            </span>
          </div>
        </div>

        {/* Right Column: Mission Briefing & Cards Deck (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Briefing Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-400">MISSION {currentMission.id} OF 8</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{currentMission.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetMission}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Restart Mission"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">{currentMission.briefing}</p>

            {/* Fuel & Target indicators */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">START DEPTH</span>
                <span className="font-mono font-bold text-white">
                  {currentMission.startingDepth > 0 ? `+${currentMission.startingDepth}m` : `${currentMission.startingDepth}m`}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">TARGET DEPTH</span>
                <span className="font-mono font-bold text-emerald-400">
                  {currentMission.targetDepth > 0 ? `+${currentMission.targetDepth}m` : `${currentMission.targetDepth}m`}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">FUEL UNITS</span>
                <span className={`font-mono font-bold ${fuelLeft <= 1 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {fuelLeft} moves left
                </span>
              </div>
            </div>

            {/* Hint toggler */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? 'Hide Tactical Hint' : 'Need Tactical Hint?'}</span>
              </button>
            </div>
            {showHint && (
              <div className="mt-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                {currentMission.hint}
              </div>
            )}
          </div>

          {/* Operation Cards Deck */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">SELECT MANEUVER CARD</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentMission.cards.map((card) => {
                const isUsed = usedCardIds.has(card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => handleApplyCard(card)}
                    disabled={isUsed || fuelLeft <= 0 || isSuccess}
                    className={`p-4 rounded-xl border font-mono text-center transition-all cursor-pointer ${
                      isUsed
                        ? 'opacity-30 bg-slate-950 border-slate-800 text-slate-600 line-through'
                        : 'bg-slate-800/90 border-slate-700 text-white hover:border-cyan-400 hover:bg-slate-800 active:scale-95 shadow-md'
                    }`}
                  >
                    <div className="text-base font-extrabold text-cyan-300">{card.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-sans">
                      {card.operation === '+' && 'Add Ballast/Lift'}
                      {card.operation === '-' && 'Drop Ballast/Lift'}
                      {card.operation === '×' && 'Vortex Thruster'}
                      {card.operation === '÷' && 'Discharge Valve'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Maneuvers sequence history */}
            {appliedCards.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Maneuver Sequence:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{currentMission.startingDepth}m</span>
                  {appliedCards.map((c, i) => (
                    <React.Fragment key={i}>
                      <span className="text-xs text-slate-500">→</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs font-bold">
                        {c.label} ({c.resultDepth}m)
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Victory Modal / Banner */}
          {isSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-2xl p-6 text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-base text-white">Target Reached! Mission Complete!</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    Excellent navigational calculations, Chief Pilot.
                  </p>
                </div>
              </div>
              {missionIndex < SUBMARINE_MISSIONS.length - 1 ? (
                <button
                  onClick={handleNextMission}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 shadow transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Next Mission</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-bold text-amber-300 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40">
                  All Missions Conquered! 🏆
                </span>
              )}
            </div>
          )}

          {/* Out of fuel warning */}
          {!isSuccess && fuelLeft <= 0 && (
            <div className="bg-rose-950/60 border border-rose-500/40 rounded-2xl p-4 text-rose-200 flex items-center justify-between">
              <div className="text-xs">
                <strong>Submersible Out of Fuel:</strong> You missed the target depth. Click retry to recalculate your maneuver trajectory.
              </div>
              <button
                onClick={handleResetMission}
                className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-lg whitespace-nowrap ml-3"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
