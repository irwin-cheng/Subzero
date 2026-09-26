import React, { useState, useEffect, useRef } from 'react';
import { generateStreakQuestion, QuizQuestion } from '../../utils/mathHelpers';
import { playSound } from '../../utils/audio';
import { Flame, Clock, Award, RotateCcw, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export const StreakArenaGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('subzero_best_streak') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentQ, setCurrentQ] = useState<QuizQuestion>(generateStreakQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [misconceptionExplanation, setMisconceptionExplanation] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // Game over
      playSound('victory');
      setIsPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    playSound('whoosh');
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setSelectedAnswer(null);
    setFeedback(null);
    setMisconceptionExplanation(null);
    setCurrentQ(generateStreakQuestion());
    setIsPlaying(true);
  };

  const handleSelectChoice = (choice: number) => {
    if (!isPlaying || selectedAnswer !== null) return;

    setSelectedAnswer(choice);
    const isCorrect = choice === currentQ.correctAnswer;

    if (isCorrect) {
      playSound('chime');
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 10 * Math.min(5, Math.floor(newStreak / 2) + 1);
      setScore((s) => s + points);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        try {
          localStorage.setItem('subzero_best_streak', newStreak.toString());
        } catch {
          // ignore
        }
      }

      // Next question after brief pause
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback(null);
        setCurrentQ(generateStreakQuestion());
      }, 400);
    } else {
      playSound('thud');
      setFeedback('wrong');
      setStreak(0);
      setMisconceptionExplanation(currentQ.misconceptionTip);
    }
  };

  const dismissExplanationAndContinue = () => {
    playSound('pop');
    setSelectedAnswer(null);
    setFeedback(null);
    setMisconceptionExplanation(null);
    setCurrentQ(generateStreakQuestion());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
              <span>GAME 3</span>
              <span>·</span>
              <span>SPEED & MASTERY ARENA</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">Speed Streak Arena</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Solve procedurally generated negative number arithmetic under a 60-second clock. Build combos and read targeted misconception busters when you miss!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Best Streak:</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {!isPlaying && timeLeft === 60 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto text-3xl">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-white">Ready for the 60-Second Challenge?</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Test your reflexes on addition, subtraction, multiplication, and division of negative integers.
            Streaks multiply your score!
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer"
          >
            Start 60-Second Arena
          </button>
        </div>
      )}

      {!isPlaying && timeLeft === 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 className="text-xl font-bold text-white">Time's Up!</h3>
          <div className="flex justify-center gap-6 font-mono text-sm py-2">
            <div>
              <span className="text-slate-400 block text-xs">Final Score:</span>
              <span className="text-2xl font-bold text-emerald-400">{score}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Best Streak:</span>
              <span className="text-2xl font-bold text-amber-400">{streak}</span>
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-2.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-400/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}

      {isPlaying && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* HUD Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">Time:</span>
              <span className={`font-mono font-bold text-base ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Streak:</span>
              <span className="font-mono font-bold text-amber-300 text-base">{streak}</span>
              {streak >= 3 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
                  {Math.min(5, Math.floor(streak / 2) + 1)}x PTS
                </span>
              )}
            </div>

            <div className="text-xs font-mono">
              <span className="text-slate-400">Score: </span>
              <span className="font-bold text-emerald-400 text-base">{score}</span>
            </div>
          </div>

          {/* Active Question Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {currentQ.op === '+' && 'Addition Problem'}
              {currentQ.op === '-' && 'Subtraction Problem'}
              {currentQ.op === '×' && 'Multiplication Problem'}
              {currentQ.op === '÷' && 'Division Problem'}
            </div>

            <div className="font-mono text-4xl sm:text-5xl font-extrabold text-white flex items-center justify-center gap-3">
              <span className={currentQ.a < 0 ? 'text-amber-400' : 'text-white'}>
                {currentQ.a < 0 ? `(${currentQ.a})` : currentQ.a}
              </span>
              <span className="text-slate-400">{currentQ.op}</span>
              <span className={currentQ.b < 0 ? 'text-rose-400' : 'text-white'}>
                {currentQ.b < 0 ? `(${currentQ.b})` : currentQ.b}
              </span>
              <span className="text-slate-400">=</span>
              <span className="text-cyan-400">?</span>
            </div>

            {/* Answer Choices Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
              {currentQ.choices.map((choice, idx) => {
                const isSelected = selectedAnswer === choice;
                const isCorrect = choice === currentQ.correctAnswer;

                let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700';
                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold';
                  } else {
                    btnStyle = 'opacity-30 bg-slate-900 border-slate-800 text-slate-600';
                  }
                }

                return (
                  <button
                    key={`${choice}-${idx}`}
                    onClick={() => handleSelectChoice(choice)}
                    disabled={selectedAnswer !== null}
                    className={`py-4 px-6 rounded-xl border font-mono text-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer ${btnStyle}`}
                  >
                    {choice > 0 ? `+${choice}` : choice}
                  </button>
                );
              })}
            </div>

            {/* Misconception Buster Popup on Wrong Answer */}
            {misconceptionExplanation && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-left space-y-3">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>MISCONCEPTION BUSTER: Why was this wrong?</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {misconceptionExplanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={dismissExplanationAndContinue}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                  >
                    <span>I Understand, Next!</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
