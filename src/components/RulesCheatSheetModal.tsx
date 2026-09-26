import React from 'react';
import { X, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface RulesCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesCheatSheetModal: React.FC<RulesCheatSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Negative Numbers: The Visual Pocket Guide</h2>
            <p className="text-xs text-slate-400 mt-0.5">The intuitive mental models middle schoolers need for 7.NS mastery</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Card 1: Addition */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center">+</span>
              <h3 className="font-semibold text-white text-sm">Addition of Negatives</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/40">
                <strong className="text-amber-300">Same Signs:</strong> Add the numbers and keep the sign!
                <br />
                <span className="font-mono text-emerald-300">(-3) + (-5) = -8</span> (Combine debt)
              </p>
              <p className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/40">
                <strong className="text-amber-300">Different Signs:</strong> Subtract the smaller from the larger absolute value. Keep the sign of the larger!
                <br />
                <span className="font-mono text-emerald-300">(-8) + 5 = -3</span> (8 negatives cancel 5 positives, 3 negatives remain)
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Zero pairs: (+1) + (-1) = 0. They disappear like matter and antimatter!</span>
              </div>
            </div>
          </div>

          {/* Card 2: Subtraction */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-rose-400/20 text-rose-400 font-bold text-xs flex items-center justify-center">−</span>
              <h3 className="font-semibold text-white text-sm">Subtraction of Negatives</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/40">
                <strong className="text-rose-300">Subtracting a Negative = ADDING!</strong>
                <br />
                <span className="font-mono text-emerald-300">4 - (-3) = 4 + 3 = 7</span>
              </p>
              <p className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/40">
                <strong className="text-slate-200">The Balloon & Sandbag Model:</strong>
                <br />
                Removing a heavy sandbag (-) makes the hot-air balloon rise UP (+)!
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Rule: Keep, Change, Change (Keep 1st, change '-' to '+', flip 2nd sign).</span>
              </div>
            </div>
          </div>

          {/* Card 3: Multiplication */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-emerald-400/20 text-emerald-400 font-bold text-xs flex items-center justify-center">×</span>
              <h3 className="font-semibold text-white text-sm">Multiplication Rules</h3>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-slate-700/40">
                <span>(+) × (+) = <strong className="text-emerald-400">(+)</strong></span>
                <span className="text-slate-400">3 × 4 = 12</span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-slate-700/40">
                <span>(+) × (-) = <strong className="text-rose-400">(-)</strong></span>
                <span className="text-slate-400">3 × (-4) = -12</span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-slate-700/40">
                <span>(-) × (+) = <strong className="text-rose-400">(-)</strong></span>
                <span className="text-slate-400">(-3) × 4 = -12</span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-amber-500/30 bg-amber-500/5">
                <span className="text-amber-300">(-) × (-) = <strong className="text-emerald-400 font-bold">(+)</strong></span>
                <span className="text-emerald-300">(-3) × (-4) = +12</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Memory rhyme: "Two negatives make a positive!" (Removing debt is a good thing).
            </p>
          </div>

          {/* Card 4: Division */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-cyan-400/20 text-cyan-400 font-bold text-xs flex items-center justify-center">÷</span>
              <h3 className="font-semibold text-white text-sm">Division Rules</h3>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-slate-700/40">
                <span>(+) ÷ (+) = <strong className="text-emerald-400">(+)</strong></span>
                <span className="text-slate-400">12 ÷ 3 = 4</span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-slate-700/40">
                <span>(-) ÷ (+) = <strong className="text-rose-400">(-)</strong></span>
                <span className="text-slate-400">-12 ÷ 3 = -4</span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-slate-700/40">
                <span>(+) ÷ (-) = <strong className="text-rose-400">(-)</strong></span>
                <span className="text-slate-400">12 ÷ (-3) = -4</span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-1.5 px-2.5 rounded border border-amber-500/30 bg-amber-500/5">
                <span className="text-amber-300">(-) ÷ (-) = <strong className="text-emerald-400 font-bold">(+)</strong></span>
                <span className="text-emerald-300">-12 ÷ (-3) = +4</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Check by multiplying back: Since (+4) × (-3) = -12, (-12) ÷ (-3) must equal +4!
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-white block font-medium">The Golden Sign Rule:</strong>
            When multiplying or dividing: <em>Same signs produce Positive (+), Different signs produce Negative (-)</em>.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
