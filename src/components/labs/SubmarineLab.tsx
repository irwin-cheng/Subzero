import React, { useState } from 'react';
import { Plus, Minus, ArrowUp, ArrowDown, HelpCircle, RefreshCw, Compass } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const SubmarineLab: React.FC = () => {
  // Current altitude/depth in meters (-40 to +20)
  const [altitude, setAltitude] = useState<number>(-10);
  const [gasBags, setGasBags] = useState<number>(2); // Each adds +5m
  const [sandbags, setSandbags] = useState<number>(4); // Each adds -5m
  const [lastAction, setLastAction] = useState<string>('Initial state: Submarine is at -10m (10 meters below sea level).');

  // Recalculate altitude based on bags: base = (gasBags * 5) - (sandbags * 5)
  // Let's allow direct actions or bag manipulation

  const addGasBag = () => {
    playSound('whoosh');
    setGasBags((prev) => prev + 1);
    setAltitude((prev) => Math.min(25, prev + 5));
    setLastAction('ADDED Helium/Lift (+5m): The vehicle ascends by 5 meters! [Current + (+5)]');
  };

  const removeGasBag = () => {
    if (gasBags <= 0) return;
    playSound('thud');
    setGasBags((prev) => prev - 1);
    setAltitude((prev) => Math.max(-50, prev - 5));
    setLastAction('REMOVED Helium/Lift (- +5m): Subtracting positive lift makes the vehicle sink 5 meters down! [Current - (+5)]');
  };

  const addSandbag = () => {
    playSound('thud');
    setSandbags((prev) => prev + 1);
    setAltitude((prev) => Math.max(-50, prev - 5));
    setLastAction('ADDED Sandbag / Ballast (+ -5m): Adding negative weight pulls the submarine 5 meters down! [Current + (-5)]');
  };

  const removeSandbag = () => {
    if (sandbags <= 0) return;
    playSound('whoosh');
    setSandbags((prev) => prev - 1);
    setAltitude((prev) => Math.min(25, prev + 5));
    setLastAction('REMOVED Sandbag / Ballast (- -5m): SUBTRACTING A NEGATIVE weight relieves heavy downward pull, causing the vehicle to ASCEND 5 meters! [Current - (-5) = Current + 5]');
  };

  const resetAll = () => {
    playSound('whoosh');
    setAltitude(0);
    setGasBags(2);
    setSandbags(2);
    setLastAction('Reset to Sea Level (0m). Both lift and ballast are equal.');
  };

  // Convert altitude to percentage position for vertical track: range -50 to +25 (total span 75m)
  // top 0% is +25m, bottom 100% is -50m
  const percentageFromTop = Math.max(0, Math.min(100, ((25 - altitude) / 75) * 100));

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <span>MODEL 2</span>
              <span>·</span>
              <span>VERTICAL ALTITUDE & BALLAST DYNAMICS</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">Submarine & Altitude Simulator</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Sea level is <strong className="text-cyan-300">0 meters</strong>. Helium gas bags represent{' '}
              <strong className="text-amber-400">positive lift (+)</strong>. Sandbags represent{' '}
              <strong className="text-rose-400">negative weight (-)</strong>. Watch what happens when you cut off a sandbag!
            </p>
          </div>

          <button
            onClick={resetAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Sea Level (0m)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Vertical Depth Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[520px]">
          {/* Background zones: Sky (+25 to 0), Shallow (0 to -20), Deep Sea (-20 to -50) */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Sky zone */}
            <div className="h-[33.3%] bg-gradient-to-b from-sky-900/60 to-cyan-900/40 border-b border-cyan-500/30" />
            {/* Shallow reef */}
            <div className="h-[26.7%] bg-gradient-to-b from-cyan-950/80 to-blue-950/90 border-b border-blue-500/30" />
            {/* Deep abyss */}
            <div className="h-[40%] bg-gradient-to-b from-blue-950 to-slate-950" />
          </div>

          {/* Sea Level Line Marker */}
          <div
            className="absolute left-0 right-0 z-10 flex items-center px-4 pointer-events-none"
            style={{ top: '33.33%' }}
          >
            <div className="w-full border-t-2 border-dashed border-cyan-400/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/40">
                0m SEA LEVEL
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">BOUNDARY (+ / -)</span>
            </div>
          </div>

          {/* Altitude Ticks on the left */}
          <div className="absolute top-4 bottom-4 left-3 w-12 flex flex-col justify-between text-[11px] font-mono font-bold text-slate-400 pointer-events-none z-10">
            <span className="text-amber-400">+25m (Sky)</span>
            <span className="text-sky-300">+10m</span>
            <span className="text-cyan-300 font-extrabold">0m</span>
            <span className="text-slate-400">-10m</span>
            <span className="text-slate-400">-25m</span>
            <span className="text-rose-400">-40m</span>
            <span className="text-rose-500">-50m (Abyss)</span>
          </div>

          {/* Animated Vessel Container */}
          <div className="relative h-full mx-14 my-4">
            <div
              className="absolute left-0 right-0 transition-all duration-500 ease-out z-20 flex flex-col items-center"
              style={{ top: `${percentageFromTop}%`, transform: 'translateY(-50%)' }}
            >
              {/* Balloon or Submarine graphic based on altitude */}
              <div
                className={`p-3 rounded-2xl border shadow-xl flex items-center gap-3 transition-colors ${
                  altitude >= 0
                    ? 'bg-amber-500/20 border-amber-400/60 shadow-amber-500/10'
                    : 'bg-cyan-900/40 border-cyan-400/60 shadow-cyan-500/10'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-lg shadow">
                  {altitude >= 0 ? '🎈' : '⚓'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{altitude >= 0 ? 'Hot Air Vessel' : 'Nautilus Submersible'}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono font-bold ${
                        altitude >= 0 ? 'bg-amber-400/20 text-amber-300' : 'bg-cyan-400/20 text-cyan-300'
                      }`}
                    >
                      {altitude > 0 ? `+${altitude}m` : `${altitude}m`}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                    <span className="text-amber-400 font-mono">🎈 {gasBags} Lift</span>
                    <span>·</span>
                    <span className="text-rose-400 font-mono">⚖️ {sandbags} Ballast</span>
                  </div>
                </div>
              </div>

              {/* Indicator ping */}
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping mt-1" />
            </div>
          </div>

          {/* Bottom depth status readout */}
          <div className="z-10 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-slate-300">Vessel Telemetry:</span>
            </div>
            <div className="font-mono font-bold text-sm text-white">
              Depth:{' '}
              <span className={altitude >= 0 ? 'text-amber-400' : 'text-cyan-400'}>
                {altitude > 0 ? `+${altitude}m` : `${altitude}m`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls & Concept Mechanics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Pad */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider">PHYSICS ACTUATORS</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Positive Lift Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🎈</span>
                    <span className="text-xs font-bold text-amber-400">Positive Lift (+)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">{gasBags} active</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">Each helium balloon pulls UP by +5 meters.</p>
                <div className="flex gap-2">
                  <button
                    onClick={addGasBag}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lift (+5)</span>
                  </button>
                  <button
                    onClick={removeGasBag}
                    disabled={gasBags <= 0}
                    className="py-2 px-3 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Subtracting positive lift causes descent"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Cut (-5)</span>
                  </button>
                </div>
              </div>

              {/* Negative Ballast Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">⚖️</span>
                    <span className="text-xs font-bold text-rose-400">Negative Ballast (-)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">{sandbags} active</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">Each sandbag drags DOWN by -5 meters.</p>
                <div className="flex gap-2">
                  <button
                    onClick={addSandbag}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Weight (+ -5)</span>
                  </button>
                  <button
                    onClick={removeSandbag}
                    disabled={sandbags <= 0}
                    className="py-2 px-3 text-xs font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 disabled:opacity-40 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="SUBTRACTING A NEGATIVE: cutting off sandbags makes you RISE!"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Cut Weight (- -5)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Last Action Reaction banner */}
            <div className="mt-5 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-200">
                <strong className="text-white block font-medium">Physical Effect:</strong>
                {lastAction}
              </div>
            </div>
          </div>

          {/* Conceptual Translation Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider">THE 4 PHYSICAL OPERATIONS</h3>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400">+ (+5)</span>
                  <span className="text-slate-300">Add positive lift</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-emerald-400">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Rises (+5m)</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-rose-400">+ (-5)</span>
                  <span className="text-slate-300">Add negative ballast weight</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-rose-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Sinks (-5m)</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-rose-400">- (+5)</span>
                  <span className="text-slate-300">Remove positive lift</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-rose-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Sinks (-5m)</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300">- (-5)</span>
                  <span className="text-amber-100 font-medium">Remove negative ballast weight</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-300">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>RISES (+5m)!</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Notice how <strong>+ (+5)</strong> and <strong>- (-5)</strong> have the exact same result: cutting ballast makes you go UP!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
