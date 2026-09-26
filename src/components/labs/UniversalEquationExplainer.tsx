import React, { useState } from 'react';
import { Operation } from '../../types/math';
import { getConceptualExplanation, calculateResult } from '../../utils/mathHelpers';
import { playSound } from '../../utils/audio';
import { Calculator, ArrowRight, Sparkles, Compass, Footprints, BookOpen } from 'lucide-react';

export const UniversalEquationExplainer: React.FC = () => {
  const [valA, setValA] = useState<number>(-8);
  const [op, setOp] = useState<Operation>('-');
  const [valB, setValB] = useState<number>(-5);

  const result = calculateResult(valA, op, valB);
  const explanation = getConceptualExplanation(valA, op, valB);

  const presetExamples = [
    { a: 3, op: '-' as Operation, b: -4, label: '3 - (-4)' },
    { a: -6, op: '+' as Operation, b: 9, label: '(-6) + 9' },
    { a: -4, op: '×' as Operation, b: -3, label: '(-4) × (-3)' },
    { a: -24, op: '÷' as Operation, b: 6, label: '(-24) ÷ 6' },
  ];

  const handleApplyPreset = (p: { a: number; op: Operation; b: number }) => {
    playSound('pop');
    setValA(p.a);
    setOp(p.op);
    setValB(p.b);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>CUSTOM EQUATION WORKSHOP</span>
          </div>
          <h3 className="text-xl font-bold font-display text-white">Universal Conceptual Explainer</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Test any numbers and see all 3 visual representations break down the exact mathematical reason!
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/50">
          {presetExamples.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center max-w-xl mx-auto">
        {/* Value A */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <label className="text-[10px] font-bold text-slate-400 block mb-1">FIRST NUMBER (A)</label>
          <input
            type="number"
            min="-50"
            max="50"
            value={valA}
            onChange={(e) => {
              setValA(parseInt(e.target.value, 10) || 0);
              playSound('pop');
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-center font-mono font-bold text-lg text-white"
          />
        </div>

        {/* Operation */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <label className="text-[10px] font-bold text-slate-400 block mb-1">OPERATION</label>
          <div className="grid grid-cols-4 gap-1">
            {(['+', '-', '×', '÷'] as Operation[]).map((operator) => (
              <button
                key={operator}
                onClick={() => {
                  setOp(operator);
                  playSound('pop');
                }}
                className={`py-1.5 rounded-lg font-mono font-bold text-base transition-colors cursor-pointer ${
                  op === operator ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                {operator}
              </button>
            ))}
          </div>
        </div>

        {/* Value B */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <label className="text-[10px] font-bold text-slate-400 block mb-1">SECOND NUMBER (B)</label>
          <input
            type="number"
            min="-50"
            max="50"
            value={valB}
            onChange={(e) => {
              setValB(parseInt(e.target.value, 10) || 1);
              playSound('pop');
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-center font-mono font-bold text-lg text-white"
          />
        </div>
      </div>

      {/* Primary Result Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
        <div className="font-mono text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span className={valA < 0 ? 'text-amber-400' : 'text-white'}>
            {valA < 0 ? `(${valA})` : valA}
          </span>
          <span className="text-slate-400">{op}</span>
          <span className={valB < 0 ? 'text-rose-400' : 'text-white'}>
            {valB < 0 ? `(${valB})` : valB}
          </span>
          <span className="text-slate-400">=</span>
          <span className="text-emerald-400 font-extrabold">{result}</span>
        </div>
        <p className="text-xs font-semibold text-amber-300 mt-2">{explanation.ruleSummary}</p>
      </div>

      {/* 3 Visual Models Breakdown Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model 1: Counters */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>1. Zero-Pair Counters</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5">
            {explanation.counterExplanation.map((point, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">·</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Model 2: Submarine / Balloon */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Compass className="w-4 h-4" />
            <span>2. Submarine & Balloon Physics</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5">
            {explanation.subBalloonExplanation.map((point, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">·</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Model 3: Rover Number Line */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Footprints className="w-4 h-4" />
            <span>3. Rover Number Line</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5">
            {explanation.numberLineExplanation.map((point, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">·</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pattern proof if available */}
      {explanation.patternProof && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Mathematical Pattern Continuity Proof</span>
          </div>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            {explanation.patternProof.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
