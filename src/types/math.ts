export type Operation = '+' | '-' | '×' | '÷';

export interface EquationProblem {
  id: string;
  a: number;
  operation: Operation;
  b: number;
  result: number;
  explanation: {
    rule: string;
    numberLineNote: string;
    counterNote: string;
    balloonNote: string;
  };
}

export interface SubmarineMission {
  id: number;
  title: string;
  briefing: string;
  startingDepth: number; // e.g., 0 or -10
  targetDepth: number;   // e.g., -25
  fuelLimit: number;     // max steps
  cards: {
    id: string;
    label: string;
    operation: Operation;
    value: number; // can be positive or negative
    used?: boolean;
  }[];
  hint: string;
}

export interface AlchemistLevel {
  id: number;
  title: string;
  targetNetCharge: number;
  initialPositives: number;
  initialNegatives: number;
  allowAddZeroPair: boolean;
  allowRemovePositives: boolean;
  allowRemoveNegatives: boolean;
  instruction: string;
  storyExplanation: string;
}

export interface MatrixPuzzle {
  id: number;
  title: string;
  size: 3; // 3x3 grid
  rowTargets: { op: Operation; target: number }[];
  colTargets: { op: Operation; target: number }[];
  initialGrid: (number | null)[][];
  solution: number[][];
  allowedNumbers: number[];
}

export type ActiveTab = 'overview' | 'counters' | 'submarine' | 'numberline' | 'patterns' | 'games';
export type ActiveGame = 'rescue' | 'alchemist' | 'matrix' | 'streak';
