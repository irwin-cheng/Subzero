import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, ArrowLeft, Footprints, HelpCircle } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const NumberLineLab: React.FC = () => {
  const [startPos, setStartPos] = useState<number>(3);
  const [operation, setOperation] = useState<'+' | '-'>('-');
  const [stepVal, setStepVal] = useState<number>(-4);

  const [currentPos, setCurrentPos] = useState<number>(3);
  const [roverFacing, setRoverFacing] = useState<'right' | 'left'>('left');
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkPhase, setWalkPhase] = useState<'ready' | 'turned' | 'walked'>('ready');
  const [stepFootprints, setStepFootprints] = useState<number[]>([]);

  // Theoretical final position
  const targetPos = operation === '+' ? startPos + stepVal : startPos - stepVal;

  const executeWalk = () => {
    if (isWalking) return;
    setIsWalking(true);
    setCurrentPos(startPos);
    setStepFootprints([]);
    setWalkPhase('ready');

    // Step 1: Face direction determined by operation
    // '+' means face right; '-' means face left
    playSound('whoosh');
    const targetFacing = operation === '+' ? 'right' : 'left';
    setRoverFacing(targetFacing);
    setWalkPhase('turned');

    // Step 2: Animate steps
    const totalSteps = Math.abs(stepVal);
    // direction on axis:
    // If facing right and stepVal > 0 -> travel right (+1)
    // If facing right and stepVal < 0 -> travel left (-1)
    // If facing left and stepVal > 0 -> travel left (-1)
    // If facing left and stepVal < 0 -> travel right (+1)
    const delta = operation === '+' ? (stepVal >= 0 ? 1 : -1) : (stepVal >= 0 ? -1 : 1);

    let currentStep = 0;
    let intermediatePos = startPos;
    const footprints: number[] = [startPos];

    const interval = setInterval(() => {
      currentStep++;
      intermediatePos += delta;
      footprints.push(intermediatePos);
      setStepFootprints([...footprints]);
      setCurrentPos(intermediatePos);
      playSound('pop');

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setIsWalking(false);
        setWalkPhase('walked');
        playSound('chime');
      }
    }, 350);
  };

  const resetRover = () => {
    setCurrentPos(startPos);
    setRoverFacing(operation === '+' ? 'right' : 'left');
    setStepFootprints([]);
    setWalkPhase('ready');
  };

  // Preset scenarios
  const setPreset = (start: number, op: '+' | '-', step: number) => {
    setStartPos(start);
    setOperation(op);
    setStepVal(step);
    setCurrentPos(start);
    setRoverFacing(op === '+' ? 'right' : 'left');
    setStepFootprints([]);
    setWalkPhase('ready');
  };

  // Convert position -10 to +10 into percentage for horizontal track
  const getPercentage = (val: number) => {
    return Math.max(0, Math.min(100, ((val + 10) / 20) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span>MODEL 3</span>
              <span>·</span>
              <span>VECTOR DIRECTION & REVERSE WALKING</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">The Number Line Rover</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Understand signs as two separate instructions: <strong>Operation (+ / -)</strong> sets which way the Rover faces,
              and <strong>Operand (+ / -)</strong> sets whether it walks Forward or in Reverse (Backward)!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setPreset(3, '-', -4)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                startPos === 3 && operation === '-' && stepVal === -4
                  ? 'bg-emerald-400 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Demo: 3 - (-4)
            </button>
            <button
              onClick={() => setPreset(-2, '+', -5)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                startPos === -2 && operation === '+' && stepVal === -5
                  ? 'bg-emerald-400 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Demo: (-2) + (-5)
            </button>
            <button
              onClick={() => setPreset(-4, '-', -7)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                startPos === -4 && operation === '-' && stepVal === -7
                  ? 'bg-emerald-400 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Demo: (-4) - (-7)
            </button>
          </div>
        </div>
      </div>

      {/* Main Number Line Arena */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        {/* Live Equation Display */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="font-mono text-2xl font-extrabold text-white flex items-center gap-2">
              <span className="text-amber-400">{startPos}</span>
              <span className="text-slate-400">{operation}</span>
              <span className={stepVal < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                {stepVal < 0 ? `(${stepVal})` : stepVal}
              </span>
              <span className="text-slate-400">=</span>
              <span className="text-emerald-400 font-bold bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                {targetPos}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={executeWalk}
              disabled={isWalking}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isWalking ? 'Rover Moving...' : 'Execute Walk'}</span>
            </button>
            <button
              onClick={resetRover}
              disabled={isWalking}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Reset Rover to Start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Track Area */}
        <div className="py-12 px-6">
          <div className="relative h-28 flex items-center">
            {/* The Number Line Line */}
            <div className="absolute left-0 right-0 h-1.5 bg-slate-700 rounded-full" />
            {/* Zero Axis Accent Marker */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400/80 rounded z-10"
              style={{ left: `${getPercentage(0)}%`, transform: 'translateX(-50%)' }}
            />

            {/* Footprint Traces */}
            {stepFootprints.map((pos, idx) => (
              <div
                key={`fp-${pos}-${idx}`}
                className="absolute z-10 w-2 h-2 rounded-full bg-amber-400 shadow-sm"
                style={{ left: `${getPercentage(pos)}%`, transform: 'translateX(-50%)' }}
              />
            ))}

            {/* Coordinate Ticks (-10 to +10) */}
            {Array.from({ length: 21 }, (_, i) => i - 10).map((tick) => {
              const isZero = tick === 0;
              const isStart = tick === startPos;
              const isTarget = tick === targetPos;

              return (
                <div
                  key={tick}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${getPercentage(tick)}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Tick marker */}
                  <div
                    className={`w-0.5 ${
                      isZero
                        ? 'h-6 bg-cyan-400'
                        : isStart
                        ? 'h-5 bg-amber-400'
                        : isTarget
                        ? 'h-5 bg-emerald-400'
                        : tick % 5 === 0
                        ? 'h-4 bg-slate-500'
                        : 'h-2 bg-slate-700'
                    }`}
                  />
                  {/* Label */}
                  <span
                    className={`text-[11px] font-mono mt-2 tabular-nums select-none ${
                      isZero
                        ? 'text-cyan-300 font-extrabold text-xs'
                        : isStart
                        ? 'text-amber-400 font-bold'
                        : isTarget
                        ? 'text-emerald-400 font-bold'
                        : tick % 2 === 0
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {tick}
                  </span>
                </div>
              );
            })}

            {/* Animated Rover Figure */}
            <div
              className="absolute z-20 transition-all duration-300 ease-out flex flex-col items-center"
              style={{
                left: `${getPercentage(currentPos)}%`,
                top: '-24px',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                className={`p-2.5 rounded-2xl border shadow-xl flex items-center justify-center transition-transform ${
                  roverFacing === 'left' ? 'scale-x-[-1]' : 'scale-x-100'
                } ${
                  currentPos === targetPos && walkPhase === 'walked'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800 border-amber-400/80 text-amber-300'
                }`}
              >
                <span className="text-xl">🤖</span>
              </div>
              <div className="mt-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                pos: {currentPos}
              </div>
            </div>
          </div>
        </div>

        {/* Rover Rules Deconstruction Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-bold text-amber-400 tracking-wider">1. START LOCATION</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Position: {startPos}</span>
              <input
                type="range"
                min="-10"
                max="10"
                value={startPos}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setStartPos(val);
                  setCurrentPos(val);
                }}
                disabled={isWalking}
                className="w-24 accent-amber-400 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Rover begins right at point {startPos}.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-bold text-cyan-400 tracking-wider">2. OPERATION (FACING)</div>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setOperation('+');
                  setRoverFacing('right');
                }}
                disabled={isWalking}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                  operation === '+' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>+ Face Right</span>
              </button>
              <button
                onClick={() => {
                  setOperation('-');
                  setRoverFacing('left');
                }}
                disabled={isWalking}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                  operation === '-' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>- Turn Left</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {operation === '+' ? "'+' means stand facing the positive (right) side." : "'-' means turn 180° to face the negative (left) side."}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-bold text-rose-400 tracking-wider">3. STEP DIRECTION</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Step: {stepVal}</span>
              <input
                type="range"
                min="-10"
                max="10"
                value={stepVal}
                onChange={(e) => setStepVal(parseInt(e.target.value, 10))}
                disabled={isWalking}
                className="w-24 accent-rose-400 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 shrink-0" />
              <span>
                {stepVal >= 0 ? `Step forward ${stepVal} paces.` : `Negative value: walk BACKWARD ${Math.abs(stepVal)} paces in reverse!`}
              </span>
            </p>
          </div>
        </div>

        {/* Summary takeaway */}
        <div className="mt-6 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-200">
            <strong className="text-white block font-medium">Why does 3 - (-4) = 7?</strong>
            Because the Rover turns around to <em>face Left</em> (subtraction), and then walks <em>Backward in reverse</em> (negative step).
            Walking backward while facing left carries the Rover toward the <strong>Right</strong>, arriving at positive 7!
          </div>
        </div>
      </div>
    </div>
  );
};
