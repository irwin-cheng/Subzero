import React, { useState } from 'react';
import { MATRIX_PUZZLES } from '../../utils/mathHelpers';
import { MatrixPuzzle, Operation } from '../../types/math';
import { playSound } from '../../utils/audio';
import { RotateCcw, CheckCircle2, ChevronRight, HelpCircle, Grid3X3 } from 'lucide-react';

export const EquationMatrixGame: React.FC = () => {
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const currentPuzzle: MatrixPuzzle = MATRIX_PUZZLES[puzzleIndex];

  const [grid, setGrid] = useState<(number | null)[][]>(() =>
    currentPuzzle.initialGrid.map((row) => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // Helper to evaluate row or column operation
  const evaluateLine = (nums: (number | null)[], op: Operation): number | null => {
    if (nums.some((n) => n === null)) return null;
    const cleanNums = nums as number[];

    if (op === '+') return cleanNums.reduce((acc, curr) => acc + curr, 0);
    if (op === '×') return cleanNums.reduce((acc, curr) => acc * curr, 1);
    return null;
  };

  const handleCellClick = (r: number, c: number) => {
    // If initially locked (not null in initialGrid), can't edit
    if (currentPuzzle.initialGrid[r][c] !== null) return;
    playSound('pop');
    setSelectedCell({ r, c });
  };

  const handleInsertNumber = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;

    playSound('pop');
    const newGrid = grid.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? num : val))
    );
    setGrid(newGrid);

    // Check if entire puzzle is solved
    let solved = true;
    for (let i = 0; i < 3; i++) {
      const rowVal = evaluateLine(newGrid[i], currentPuzzle.rowTargets[i].op);
      if (rowVal !== currentPuzzle.rowTargets[i].target) solved = false;

      const colNums = [newGrid[0][i], newGrid[1][i], newGrid[2][i]];
      const colVal = evaluateLine(colNums, currentPuzzle.colTargets[i].op);
      if (colVal !== currentPuzzle.colTargets[i].target) solved = false;
    }

    if (solved) {
      playSound('victory');
      setIsSolved(true);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const newGrid = grid.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? null : val))
    );
    setGrid(newGrid);
    setIsSolved(false);
  };

  const handleResetPuzzle = () => {
    playSound('whoosh');
    setGrid(currentPuzzle.initialGrid.map((row) => [...row]));
    setSelectedCell(null);
    setIsSolved(false);
  };

  const handleNextPuzzle = () => {
    if (puzzleIndex < MATRIX_PUZZLES.length - 1) {
      const nextIdx = puzzleIndex + 1;
      setPuzzleIndex(nextIdx);
      const nextPuz = MATRIX_PUZZLES[nextIdx];
      setGrid(nextPuz.initialGrid.map((row) => [...row]));
      setSelectedCell(null);
      setIsSolved(false);
      playSound('whoosh');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span>GAME 4</span>
              <span>·</span>
              <span>GRID EQUATION LOGIC</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">Negative Equation Matrix</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Fill the missing cells so every row and column satisfies its target product or sum. Watch out for negative sign interactions!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetPuzzle}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Reset Puzzle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Grid Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Grid3X3 className="w-4 h-4 text-emerald-400" />
                <span>{currentPuzzle.title}</span>
              </span>
              <span className="text-[11px] text-slate-400">Click an empty cell, then select a number below</span>
            </div>

            {/* Matrix Table */}
            <div className="inline-block mx-auto max-w-md w-full">
              {/* Column Clues Header */}
              <div className="grid grid-cols-4 gap-2 mb-2 text-center text-xs font-mono">
                <div className="text-slate-600">COL ➔</div>
                {currentPuzzle.colTargets.map((col, ci) => {
                  const colNums = [grid[0][ci], grid[1][ci], grid[2][ci]];
                  const currentVal = evaluateLine(colNums, col.op);
                  const isMatch = currentVal === col.target;

                  return (
                    <div
                      key={`col-${ci}`}
                      className={`p-2 rounded-lg border font-bold ${
                        isMatch
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 font-sans">{col.op === '×' ? 'Product' : 'Sum'}</div>
                      <div>{col.target > 0 ? `+${col.target}` : col.target}</div>
                    </div>
                  );
                })}
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {grid.map((row, ri) => {
                  const rowTarget = currentPuzzle.rowTargets[ri];
                  const currentVal = evaluateLine(row, rowTarget.op);
                  const isMatch = currentVal === rowTarget.target;

                  return (
                    <div key={`row-${ri}`} className="grid grid-cols-4 gap-2 items-center">
                      {/* Row clue */}
                      <div
                        className={`p-2 rounded-lg border text-center font-mono text-xs font-bold ${
                          isMatch
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400 font-sans">{rowTarget.op === '×' ? 'Product' : 'Sum'}</div>
                        <div>{rowTarget.target > 0 ? `+${rowTarget.target}` : rowTarget.target}</div>
                      </div>

                      {/* 3 cells in row */}
                      {row.map((cellVal, ci) => {
                        const isLocked = currentPuzzle.initialGrid[ri][ci] !== null;
                        const isSelected = selectedCell?.r === ri && selectedCell?.c === ci;

                        return (
                          <button
                            key={`cell-${ri}-${ci}`}
                            onClick={() => handleCellClick(ri, ci)}
                            className={`h-16 rounded-xl font-mono text-lg font-extrabold flex items-center justify-center border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                                : isLocked
                                ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-default'
                                : cellVal !== null
                                ? 'bg-slate-800 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                                : 'bg-slate-900/60 border-dashed border-slate-700 text-slate-500 hover:border-slate-500'
                            }`}
                          >
                            {cellVal !== null ? (cellVal > 0 ? `+${cellVal}` : cellVal) : '?'}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Number Selector Drawer */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">NUMBER BANK</span>
              {selectedCell && (
                <button
                  onClick={handleClearCell}
                  className="text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Clear Selected Cell
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentPuzzle.allowedNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handleInsertNumber(num)}
                  disabled={!selectedCell}
                  className="w-12 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 font-mono text-sm font-bold text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow"
                >
                  {num > 0 ? `+${num}` : num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Help & Victory (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider">HOW TO SOLVE</h3>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              <p>
                <strong>Row Clues:</strong> Multiply or sum the 3 numbers in that row horizontally.
              </p>
              <p>
                <strong>Column Clues:</strong> Multiply or sum the 3 numbers in that column vertically.
              </p>
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-300 block font-semibold mb-1">Key Strategy:</span>
                If a product target is negative, exactly ONE or THREE factors must be negative!
                If a product target is positive, either TWO factors are negative or all are positive!
              </div>
            </div>
          </div>

          {isSolved && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-2xl p-6 text-emerald-100 shadow-xl">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Puzzle Solved!</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    All row and column sign constraints satisfied!
                  </p>
                </div>
              </div>
              {puzzleIndex < MATRIX_PUZZLES.length - 1 && (
                <button
                  onClick={handleNextPuzzle}
                  className="mt-4 w-full py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <span>Next Matrix Puzzle</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
