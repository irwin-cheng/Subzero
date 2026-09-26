import React, { useState } from 'react';
import { Plus, Minus, RefreshCw, Zap, Sparkles, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface Counter {
  id: string;
  type: 'pos' | 'neg';
  isPaired?: boolean;
  pairId?: string;
  isRemoving?: boolean;
}

export const ZeroPairLab: React.FC = () => {
  const [counters, setCounters] = useState<Counter[]>([
    { id: 'p1', type: 'pos' },
    { id: 'p2', type: 'pos' },
    { id: 'p3', type: 'pos' },
    { id: 'n1', type: 'neg' },
    { id: 'n2', type: 'neg' },
  ]);

  const [activePreset, setActivePreset] = useState<string>('custom');
  const [subtractionStep, setSubtractionStep] = useState<number>(0);
  const [explanationText, setExplanationText] = useState<string>(
    'Add positive (+1) or negative (-1) counters. Click "Neutralize Zero Pairs" to see opposing charges cancel to 0!'
  );

  const positives = counters.filter((c) => c.type === 'pos' && !c.isPaired);
  const negatives = counters.filter((c) => c.type === 'neg' && !c.isPaired);
  const pairedPairsCount = counters.filter((c) => c.isPaired && c.type === 'pos').length;
  const netCharge = positives.length - negatives.length;

  const addPositive = () => {
    playSound('pop');
    setCounters((prev) => [...prev, { id: `p-${Date.now()}-${Math.random()}`, type: 'pos' }]);
    setActivePreset('custom');
  };

  const addNegative = () => {
    playSound('thud');
    setCounters((prev) => [...prev, { id: `n-${Date.now()}-${Math.random()}`, type: 'neg' }]);
    setActivePreset('custom');
  };

  const addZeroPair = () => {
    playSound('pop');
    const pairTag = `pair-${Date.now()}`;
    setCounters((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, type: 'pos', pairId: pairTag },
      { id: `n-${Date.now()}`, type: 'neg', pairId: pairTag },
    ]);
    setExplanationText('Added a Zero Pair (+1 and -1). The net charge remains unchanged because (+1) + (-1) = 0!');
    setActivePreset('custom');
  };

  const neutralizePairs = () => {
    const unbondedPos = counters.filter((c) => c.type === 'pos' && !c.isPaired);
    const unbondedNeg = counters.filter((c) => c.type === 'neg' && !c.isPaired);

    const pairsToMake = Math.min(unbondedPos.length, unbondedNeg.length);

    if (pairsToMake === 0) {
      playSound('thud');
      setExplanationText('No opposing charges available to pair up. All remaining counters are of the same sign!');
      return;
    }

    playSound('pop');
    const posToPair = new Set(unbondedPos.slice(0, pairsToMake).map((c) => c.id));
    const negToPair = new Set(unbondedNeg.slice(0, pairsToMake).map((c) => c.id));

    setCounters((prev) =>
      prev.map((c) => {
        if (posToPair.has(c.id) || negToPair.has(c.id)) {
          return { ...c, isPaired: true };
        }
        return c;
      })
    );

    setExplanationText(
      `Neutralized ${pairsToMake} Zero Pair${pairsToMake > 1 ? 's' : ''}! Notice how (+1) and (-1) cancel each other out. Net charge is now ${netCharge}.`
    );
  };

  const clearAll = () => {
    playSound('whoosh');
    setCounters([]);
    setSubtractionStep(0);
    setActivePreset('custom');
    setExplanationText('Workbench cleared. Ready to experiment!');
  };

  const removeCounter = (id: string) => {
    playSound('pop');
    setCounters((prev) => prev.filter((c) => c.id !== id));
  };

  // Preset Demonstrations
  const loadPreset = (presetName: string) => {
    setActivePreset(presetName);
    setSubtractionStep(0);

    if (presetName === 'add_diff') {
      // 3 + (-5)
      setCounters([
        { id: 'p1', type: 'pos' },
        { id: 'p2', type: 'pos' },
        { id: 'p3', type: 'pos' },
        { id: 'n1', type: 'neg' },
        { id: 'n2', type: 'neg' },
        { id: 'n3', type: 'neg' },
        { id: 'n4', type: 'neg' },
        { id: 'n5', type: 'neg' },
      ]);
      setExplanationText('Preset: 3 + (-5). We have 3 positives and 5 negatives. Hit "Neutralize Zero Pairs" to see 3 pairs cancel, leaving -2!');
    } else if (presetName === 'sub_neg') {
      // 3 - (-2) Subtraction demo
      setCounters([
        { id: 'p1', type: 'pos' },
        { id: 'p2', type: 'pos' },
        { id: 'p3', type: 'pos' },
      ]);
      setSubtractionStep(1);
      setExplanationText('Step 1: To solve 3 - (-2), start with 3 positives. We need to take away 2 negatives, but we don\'t have any! Click "Step 2: Add Zero Pairs".');
    } else if (presetName === 'add_same') {
      // (-3) + (-4)
      setCounters([
        { id: 'n1', type: 'neg' },
        { id: 'n2', type: 'neg' },
        { id: 'n3', type: 'neg' },
        { id: 'n4', type: 'neg' },
        { id: 'n5', type: 'neg' },
        { id: 'n6', type: 'neg' },
        { id: 'n7', type: 'neg' },
      ]);
      setExplanationText('Preset: (-3) + (-4). Adding two negatives combines debts. No zero pairs can form because there are zero positives. Total = -7.');
    } else if (presetName === 'mult_neg') {
      // 2 * (-3) = -6
      setCounters([
        { id: 'n1', type: 'neg' },
        { id: 'n2', type: 'neg' },
        { id: 'n3', type: 'neg' },
        { id: 'n4', type: 'neg' },
        { id: 'n5', type: 'neg' },
        { id: 'n6', type: 'neg' },
      ]);
      setExplanationText('Preset: 2 × (-3). This means 2 groups of 3 negatives. Total = 6 negatives (-6).');
    }
  };

  const advanceSubtractionStep = () => {
    if (subtractionStep === 1) {
      // Add 2 zero pairs
      playSound('pop');
      setCounters((prev) => [
        ...prev,
        { id: 'zp-p1', type: 'pos' },
        { id: 'zp-n1', type: 'neg' },
        { id: 'zp-p2', type: 'pos' },
        { id: 'zp-n2', type: 'neg' },
      ]);
      setSubtractionStep(2);
      setExplanationText('Step 2: We introduced 2 Zero Pairs (+2 and -2). Total value is STILL 3. But now, we HAVE 2 negatives that we can remove! Click "Step 3: Remove Negatives".');
    } else if (subtractionStep === 2) {
      // Remove the 2 negatives
      playSound('whoosh');
      setCounters((prev) => prev.filter((c) => c.type !== 'neg'));
      setSubtractionStep(3);
      setExplanationText('Step 3: VAPORIZED the 2 negatives! Look at what was left behind: 5 positives! That is why 3 - (-2) = 3 + 2 = 5!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <span>MODEL 1</span>
              <span>·</span>
              <span>THE CHARGE / COUNTER MODEL</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">The Zero-Pair Laboratory</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              A yellow positive counter (+1) and a red negative counter (-1) combine to form a <strong>Zero Pair</strong>.
              Because they cancel to zero, introducing or removing them reveals why subtraction of negatives works!
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/50">
            <button
              onClick={() => loadPreset('add_diff')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'add_diff' ? 'bg-amber-400 text-slate-900 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Demo: 3 + (-5)
            </button>
            <button
              onClick={() => loadPreset('sub_neg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'sub_neg' ? 'bg-amber-400 text-slate-900 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Demo: 3 - (-2)
            </button>
            <button
              onClick={() => loadPreset('add_same')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'add_same' ? 'bg-amber-400 text-slate-900 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Demo: (-3) + (-4)
            </button>
            <button
              onClick={() => loadPreset('mult_neg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activePreset === 'mult_neg' ? 'bg-amber-400 text-slate-900 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Demo: 2 × (-3)
            </button>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Interactive Tray */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={addPositive}
                  className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add (+1) Pos</span>
                </button>
                <button
                  onClick={addNegative}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-transform active:scale-95 flex items-center gap-1 shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Add (-1) Neg</span>
                </button>
                <button
                  onClick={addZeroPair}
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
                  title="Adds one positive and one negative simultaneously (Net change: 0)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Zero Pair (+/-)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={neutralizePairs}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-1 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-slate-950" />
                  <span>Neutralize Zero Pairs</span>
                </button>
                <button
                  onClick={clearAll}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Reset workbench"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtraction Guided Steps (if active) */}
            {activePreset === 'sub_neg' && subtractionStep > 0 && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div className="text-xs text-amber-200">
                  <span className="font-semibold text-amber-400">Walkthrough: 3 - (-2)</span> · Step {subtractionStep} of 3
                </div>
                {subtractionStep < 3 && (
                  <button
                    onClick={advanceSubtractionStep}
                    className="px-3 py-1 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 shadow"
                  >
                    <span>{subtractionStep === 1 ? 'Step 2: Add 2 Zero Pairs' : 'Step 3: Remove (-2) Negatives'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {subtractionStep === 3 && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Result: +5
                  </span>
                )}
              </div>
            )}

            {/* Active Tray Arena */}
            <div className="mt-6">
              <div className="text-xs font-medium text-slate-400 mb-2 flex items-center justify-between">
                <span>ACTIVE COUNTERS TRAY (Click any token to remove it)</span>
                <span>{counters.length} total tokens</span>
              </div>

              {counters.length === 0 ? (
                <div className="h-64 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500">
                  <Sparkles className="w-8 h-8 mb-2 text-slate-600" />
                  <p className="text-sm">The workbench is empty.</p>
                  <p className="text-xs text-slate-600 mt-1">Use the buttons above or select a preset to begin.</p>
                </div>
              ) : (
                <div className="min-h-64 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-wrap gap-3 items-center content-start">
                  {/* Unpaired Positives */}
                  {counters
                    .filter((c) => !c.isPaired && c.type === 'pos')
                    .map((counter) => (
                      <button
                        key={counter.id}
                        onClick={() => removeCounter(counter.id)}
                        className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-bold font-mono text-base flex items-center justify-center shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer border-2 border-amber-300"
                        title="Click to remove (+1)"
                      >
                        +1
                      </button>
                    ))}

                  {/* Unpaired Negatives */}
                  {counters
                    .filter((c) => !c.isPaired && c.type === 'neg')
                    .map((counter) => (
                      <button
                        key={counter.id}
                        onClick={() => removeCounter(counter.id)}
                        className="w-12 h-12 rounded-full bg-rose-600 text-white font-bold font-mono text-base flex items-center justify-center shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer border-2 border-rose-400"
                        title="Click to remove (-1)"
                      >
                        -1
                      </button>
                    ))}

                  {/* Paired Zero Pairs (Grayed / Dissolving) */}
                  {counters.filter((c) => c.isPaired).length > 0 && (
                    <div className="w-full mt-4 pt-3 border-t border-slate-800/60">
                      <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>NEUTRALIZED ZERO PAIRS (+1 and -1 cancel to 0)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: pairedPairsCount }).map((_, idx) => (
                          <div
                            key={`paired-${idx}`}
                            className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 rounded-lg border border-slate-700/50 opacity-60"
                          >
                            <span className="w-6 h-6 rounded-full bg-amber-400/60 text-slate-900 font-bold text-xs flex items-center justify-center">
                              +
                            </span>
                            <span className="text-slate-400 text-xs font-mono">and</span>
                            <span className="w-6 h-6 rounded-full bg-rose-600/60 text-white font-bold text-xs flex items-center justify-center">
                              -
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 ml-1">= 0</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Explanation Footer Callout */}
          <div className="mt-4 p-3.5 bg-slate-800/60 border border-slate-700/50 rounded-xl flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">{explanationText}</p>
          </div>
        </div>

        {/* Right Col: Live Net Charge Telemetry & Conceptual Proof */}
        <div className="space-y-6">
          {/* Net Charge Gauge Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider">LIVE NET CHARGE</h3>
            <div className="mt-3 flex items-baseline justify-between">
              <span
                className={`text-5xl font-extrabold font-mono tabular-nums ${
                  netCharge > 0 ? 'text-amber-400' : netCharge < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {netCharge > 0 ? `+${netCharge}` : netCharge}
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 text-slate-300">
                {netCharge > 0 ? 'Surplus Positive' : netCharge < 0 ? 'Surplus Negative' : 'Balanced (Neutral 0)'}
              </span>
            </div>

            {/* Breakdown metrics */}
            <div className="mt-6 space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Active Positives (+):
                </span>
                <span className="font-mono font-bold text-white tabular-nums">{positives.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Active Negatives (-):
                </span>
                <span className="font-mono font-bold text-white tabular-nums">{negatives.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Neutralized Zero Pairs:
                </span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">{pairedPairsCount}</span>
              </div>
            </div>

            {/* Visual formula equation */}
            <div className="mt-6 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono text-sm text-slate-200">
              <span>Equation: </span>
              <span className="text-amber-400 font-bold">{positives.length}</span>
              <span> + </span>
              <span className="text-rose-400 font-bold">({negatives.length > 0 ? `-${negatives.length}` : 0})</span>
              <span> = </span>
              <span className={`font-bold ${netCharge >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {netCharge}
              </span>
            </div>
          </div>

          {/* Key Insight Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-amber-400 tracking-wider">THE PROFOUND RULE</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Why does subtracting a negative give a positive?
            </p>
            <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <p>
                1. Imagine you have $3. To subtract -$2, you need to remove 2 negative dollars.
              </p>
              <p>
                2. Since you have no negatives, you bring in 2 pairs of ($1 and -$1). Total money is still $3.
              </p>
              <p>
                3. Now remove the 2 negatives: you are left with <strong className="text-emerald-400">$5</strong>!
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Removing a debt or penalty is the same as earning a reward!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
