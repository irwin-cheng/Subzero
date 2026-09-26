import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, HelpCircle, Shuffle } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const PatternMatrixLab: React.FC = () => {
  const [fixedNum, setFixedNum] = useState<number>(-4);
  const [activeStep, setActiveStep] = useState<number>(-3);
  const [gridX, setGridX] = useState<number>(-3);
  const [gridY, setGridY] = useState<number>(-4);

  const patternSteps = [3, 2, 1, 0, -1, -2, -3];

  const handleStepSelect = (step: number) => {
    playSound('pop');
    setActiveStep(step);
  };

  const handleRandomizeGrid = () => {
    playSound('whoosh');
    const rx = Math.floor(Math.random() * 9) - 4;
    const ry = Math.floor(Math.random() * 9) - 4;
    setGridX(rx === 0 ? -3 : rx);
    setGridY(ry === 0 ? -2 : ry);
  };

  const gridProduct = gridX * gridY;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <span>MODEL 4</span>
              <span>·</span>
              <span>MULTIPLICATION & DIVISION CONTINUITY</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">The Pattern Matrix: Why (-) × (-) = (+)</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Mathematics requires patterns to never break. By sliding down from positive multipliers through zero,
              discover how a negative times a negative <em>must</em> equal a positive to keep arithmetic consistent!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The Inescapable Pattern Staircase (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider">THE PATTERN STAIRCASE</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Fixed Multiplicand:</span>
                <select
                  value={fixedNum}
                  onChange={(e) => {
                    setFixedNum(parseInt(e.target.value, 10));
                    playSound('pop');
                  }}
                  className="bg-slate-800 text-white font-mono text-xs rounded-lg px-2 py-1 border border-slate-700 cursor-pointer"
                >
                  <option value={-2}>-2</option>
                  <option value={-3}>-3</option>
                  <option value={-4}>-4</option>
                  <option value={-5}>-5</option>
                </select>
              </div>
            </div>

            {/* Pattern Rows */}
            <div className="mt-4 space-y-2">
              {patternSteps.map((multiplier) => {
                const prod = multiplier * fixedNum;
                const isSelected = multiplier === activeStep;
                const isNegativeTimesNegative = multiplier < 0;

                return (
                  <div
                    key={multiplier}
                    onClick={() => handleStepSelect(multiplier)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between font-mono text-xs ${
                      isSelected
                        ? isNegativeTimesNegative
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                          : 'bg-slate-800 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold ${
                        multiplier < 0 ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {multiplier}
                      </span>
                      <span>× ({fixedNum}) =</span>
                      <span className={`text-sm font-bold ${prod > 0 ? 'text-emerald-400' : prod < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {prod > 0 ? `+${prod}` : prod}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-sans">
                      {multiplier <= 2 && (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{Math.abs(fixedNum)}</span>
                        </span>
                      )}
                      {multiplier < 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                          POSITIVE!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation Footer */}
          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
            <strong className="text-white block font-medium mb-1">Look closely at the pattern:</strong>
            As the top number decreases by 1, the result increases by <span className="text-emerald-400 font-bold">+{Math.abs(fixedNum)}</span> every single step!
            When crossing 0, adding +{Math.abs(fixedNum)} turns the numbers into positives: +{Math.abs(fixedNum)}, +{Math.abs(fixedNum) * 2}, +{Math.abs(fixedNum) * 3}.
          </div>
        </div>

        {/* Right Column: 4-Quadrant Cartesian Product Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider">4-QUADRANT SIGN MATRIX</h3>
              <button
                onClick={handleRandomizeGrid}
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Random Pair</span>
              </button>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-slate-400">Factor A (X):</span>
                  <span className={`font-bold ${gridX < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {gridX}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  value={gridX}
                  onChange={(e) => {
                    setGridX(parseInt(e.target.value, 10));
                    playSound('pop');
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <span className="text-slate-400">Factor B (Y):</span>
                  <span className={`font-bold ${gridY < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {gridY}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  value={gridY}
                  onChange={(e) => {
                    setGridY(parseInt(e.target.value, 10));
                    playSound('pop');
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Matrix Result Banner */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="font-mono text-2xl font-extrabold text-white">
                <span className={gridX < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {gridX < 0 ? `(${gridX})` : gridX}
                </span>
                <span className="text-slate-400 mx-2">×</span>
                <span className={gridY < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {gridY < 0 ? `(${gridY})` : gridY}
                </span>
                <span className="text-slate-400 mx-2">=</span>
                <span
                  className={`text-2xl font-bold px-3 py-1 rounded-lg ${
                    gridProduct > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : gridProduct < 0
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'text-slate-400'
                  }`}
                >
                  {gridProduct > 0 ? `+${gridProduct}` : gridProduct}
                </span>
              </div>

              {/* Quadrant badge */}
              <div className="mt-2 text-xs text-slate-400">
                {gridX > 0 && gridY > 0 && 'Quadrant I: (+) × (+) = Positive (+)'}
                {gridX < 0 && gridY > 0 && 'Quadrant II: (-) × (+) = Negative (-)'}
                {gridX < 0 && gridY < 0 && (
                  <span className="text-amber-300 font-bold">
                    Quadrant III: (-) × (-) = POSITIVE (+) 🎉
                  </span>
                )}
                {gridX > 0 && gridY < 0 && 'Quadrant IV: (+) × (-) = Negative (-)'}
                {(gridX === 0 || gridY === 0) && 'Axis Boundary: Zero product'}
              </div>
            </div>

            {/* Division Inverse Connection */}
            <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Division is the Mirror of Multiplication:</span>
              </div>
              <p className="text-xs font-mono text-slate-300">
                If <span className="text-white font-bold">{gridX} × {gridY} = {gridProduct}</span>, then:
                <br />
                <span className="text-emerald-300">
                  {gridProduct} ÷ ({gridX}) = {gridY}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Since {gridProduct} and {gridX} have {((gridProduct < 0 && gridX > 0) || (gridProduct > 0 && gridX < 0)) ? 'different signs, result is negative' : 'the same sign, result is positive'}!
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Rule of Signs: Like signs create positive (+), unlike signs create negative (-).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
