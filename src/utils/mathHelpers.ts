import { AlchemistLevel, MatrixPuzzle, Operation, SubmarineMission } from '../types/math';

export function calculateResult(a: number, op: Operation, b: number): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      if (b === 0) return 0;
      return a / b;
  }
}

export function formatNumberWithSign(num: number): string {
  if (num < 0) return `(${num})`;
  return `${num}`;
}

export function getConceptualExplanation(a: number, op: Operation, b: number): {
  headline: string;
  ruleSummary: string;
  counterExplanation: string[];
  subBalloonExplanation: string[];
  numberLineExplanation: string[];
  patternProof?: string[];
} {
  const result = calculateResult(a, op, b);

  if (op === '+') {
    if (a >= 0 && b < 0) {
      return {
        headline: `Adding a Negative: ${a} + (${b}) = ${result}`,
        ruleSummary: `Adding a negative number is equivalent to subtracting its positive value (${a} - ${Math.abs(b)}).`,
        counterExplanation: [
          `Start with ${a} positive counter${a === 1 ? '' : 's'} (+).`,
          `Introduce ${Math.abs(b)} negative counter${Math.abs(b) === 1 ? '' : 's'} (-).`,
          `Match them up: ${Math.min(a, Math.abs(b))} zero pair${Math.min(a, Math.abs(b)) === 1 ? '' : 's'} (+ and -) cancel out to 0!`,
          `Count the un-cancelled counters: exactly ${result >= 0 ? `${result} positive` : `${Math.abs(result)} negative`} left.`,
        ],
        subBalloonExplanation: [
          `Current position: ${a} meters.`,
          `Action: Adding a sandbag with weight ${Math.abs(b)}.`,
          `Result: The extra weight pulls you DOWN by ${Math.abs(b)} meters, arriving at ${result}m.`,
        ],
        numberLineExplanation: [
          `Place the Rover on point ${a}.`,
          `'+' means face to the right (positive direction).`,
          `'${b}' is negative, which means step BACKWARD ${Math.abs(b)} steps.`,
          `Walking backward brings the rover left to ${result}.`,
        ],
      };
    } else if (a < 0 && b < 0) {
      return {
        headline: `Adding Two Negatives: (${a}) + (${b}) = ${result}`,
        ruleSummary: `Both numbers have the same negative sign. Combine their quantities and keep the negative sign: -(${Math.abs(a)} + ${Math.abs(b)}) = ${result}.`,
        counterExplanation: [
          `Start with ${Math.abs(a)} negative counters (-).`,
          `Add ${Math.abs(b)} more negative counters (-).`,
          `Since there are NO positive counters, nothing cancels out!`,
          `Total: ${Math.abs(result)} negative counters, which equals ${result}.`,
        ],
        subBalloonExplanation: [
          `You are already ${Math.abs(a)}m underwater (depth ${a}m).`,
          `You attach another anchor of weight ${Math.abs(b)}.`,
          `The extra weight sinks you even deeper to ${result}m.`,
        ],
        numberLineExplanation: [
          `Start at ${a} (left of zero).`,
          `Facing right (+), take ${Math.abs(b)} reverse steps (negative quantity).`,
          `You end up further to the left at ${result}.`,
        ],
      };
    } else {
      return {
        headline: `Addition: ${a} + ${b} = ${result}`,
        ruleSummary: `Adding a positive quantity moves in the positive direction.`,
        counterExplanation: [
          `Combine ${Math.abs(a)} ${a >= 0 ? 'positive' : 'negative'} counters and ${b} positive counters.`,
          `${Math.min(Math.abs(a), b)} zero pair(s) neutralize to 0.`,
          `The remaining net charge is ${result}.`,
        ],
        subBalloonExplanation: [
          `Position ${a}m. Adding lift of ${b} units propels you upward to ${result}m.`,
        ],
        numberLineExplanation: [
          `Start at ${a}. Facing right, step forward ${b} units to reach ${result}.`,
        ],
      };
    }
  }

  if (op === '-') {
    if (b < 0) {
      return {
        headline: `Subtracting a Negative: ${a} - (${b}) = ${result}`,
        ruleSummary: `Subtracting a negative is the exact same as ADDING a positive: ${a} - (${b}) = ${a} + ${Math.abs(b)} = ${result}.`,
        counterExplanation: [
          `Start with ${a >= 0 ? `${a} positive` : `${Math.abs(a)} negative`} counter${Math.abs(a) === 1 ? '' : 's'}.`,
          `The operation '-' says: REMOVE ${Math.abs(b)} negative counter${Math.abs(b) === 1 ? '' : 's'}.`,
          `If you don't have enough negatives to take away, add ${Math.abs(b)} ZERO PAIRS (+ and -). Zero pairs don't change the value because they equal 0!`,
          `Now TAKE AWAY the ${Math.abs(b)} negative counters.`,
          `What got left behind? ${Math.abs(b)} positive counters! Taking away negatives increased your total by +${Math.abs(b)}.`,
        ],
        subBalloonExplanation: [
          `You are at altitude/depth ${a}m with ballast sandbags weighing ${Math.abs(b)} attached.`,
          `Subtracting a negative means CUTTING OFF ${Math.abs(b)} sandbags.`,
          `When you remove heavy weights, the balloon/sub jumps UP!`,
          `Removing weight has the exact same effect as adding lift: you rise to ${result}m.`,
        ],
        numberLineExplanation: [
          `Start at point ${a}.`,
          `'-' (subtraction) tells the Rover to TURN AROUND and face LEFT (negative direction).`,
          `The step amount '${b}' is negative, meaning WALK IN REVERSE (backward).`,
          `Facing LEFT and walking BACKWARD propels the Rover to the RIGHT (+)!`,
          `So ${a} - (${b}) lands squarely at ${result}.`,
        ],
      };
    } else {
      return {
        headline: `Subtracting a Positive: ${a} - ${b} = ${result}`,
        ruleSummary: `Subtracting a positive number removes positive value or adds negative debt.`,
        counterExplanation: [
          `Start with your initial counters representing ${a}.`,
          `Remove ${b} positive counters. If not enough positives exist, introduce zero pairs to remove them.`,
          `Net result is ${result}.`,
        ],
        subBalloonExplanation: [
          `Removing ${b} gas bags (lift) causes the balloon to drop by ${b}m to ${result}m.`,
        ],
        numberLineExplanation: [
          `Start at ${a}. Facing left (subtraction), step forward ${b} units. You move left to ${result}.`,
        ],
      };
    }
  }

  if (op === '×') {
    if (a < 0 && b < 0) {
      return {
        headline: `Negative × Negative: (${a}) × (${b}) = ${result}`,
        ruleSummary: `Multiplying two negative numbers ALWAYS produces a POSITIVE number: (-) × (-) = (+).`,
        counterExplanation: [
          `Think of multiplication as starting at 0:`,
          `Positive 3 × (-2) means "ADD 3 groups of -2" = -6.`,
          `Negative (${a}) × (${b}) means "REMOVE ${Math.abs(a)} groups of ${b}".`,
          `To remove ${Math.abs(a)} groups of (${b}), we start with ${Math.abs(result)} zero pairs.`,
          `Physically remove all the negative counters: all that remains is ${result} positive counters!`,
        ],
        subBalloonExplanation: [
          `Imagine taking away (-) heavy sandbags (-) over ${Math.abs(a)} minutes.`,
          `Every minute, ${Math.abs(b)} sandbags are dropped.`,
          `Removing negative weight continuously causes rapid ASCENT (+${result}m)!`,
        ],
        numberLineExplanation: [
          `Start facing left (first negative sign).`,
          `The second number is also negative, which flips the direction again (double reverse).`,
          `Two directional reverses bring you back to facing forward in the positive direction!`,
        ],
        patternProof: [
          `Look at this inescapable mathematical pattern:`,
          ` 3 × (${b}) = ${3 * b}`,
          ` 2 × (${b}) = ${2 * b}  (+${Math.abs(b)} each step)`,
          ` 1 × (${b}) = ${1 * b}  (+${Math.abs(b)})`,
          ` 0 × (${b}) = 0   (+${Math.abs(b)})`,
          `-1 × (${b}) = +${Math.abs(b)}  (Continuing pattern: +${Math.abs(b)}!)`,
          `${a} × (${b}) = +${result}  (The pattern must remain consistent!)`,
        ],
      };
    } else if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      const pos = Math.max(a, b);
      const neg = Math.min(a, b);
      return {
        headline: `Positive × Negative: ${a} × ${b} = ${result}`,
        ruleSummary: `Multiplying a positive and a negative number ALWAYS produces a NEGATIVE number: (+) × (-) = (-).`,
        counterExplanation: [
          `This is repeated addition of debt: ${pos} groups of ${neg}.`,
          `Group 1: ${neg} counters`,
          `Add another group: total ${2 * neg}`,
          `After ${pos} groups, you have exactly ${Math.abs(result)} negative counters = ${result}.`,
        ],
        subBalloonExplanation: [
          `Adding ${pos} bundles of sandbags weighing ${Math.abs(neg)} each.`,
          `Total weight added: ${Math.abs(result)} kg downward force. You sink to ${result}m.`,
        ],
        numberLineExplanation: [
          `Taking ${pos} jumps of size ${neg} (to the left).`,
          `0 → ${neg} → ${2 * neg} ... → ${result}.`,
        ],
        patternProof: [
          `3 × ${neg} = ${3 * neg}`,
          `2 × ${neg} = ${2 * neg}`,
          `1 × ${neg} = ${1 * neg}`,
        ],
      };
    } else {
      return {
        headline: `Positive × Positive: ${a} × ${b} = ${result}`,
        ruleSummary: `Standard multiplication: positive quantities scale positively.`,
        counterExplanation: [`${a} groups of ${b} positive counters = ${result} positive counters.`],
        subBalloonExplanation: [`Adding ${a} helium clusters of power ${b} lifts by +${result}m.`],
        numberLineExplanation: [`${a} forward steps of size ${b} reaches ${result}.`],
      };
    }
  }

  // Division
  if (op === '÷') {
    if (a < 0 && b < 0) {
      return {
        headline: `Negative ÷ Negative: (${a}) ÷ (${b}) = ${result}`,
        ruleSummary: `Dividing a negative by a negative gives a POSITIVE number: (-) ÷ (-) = (+).`,
        counterExplanation: [
          `Division asks: "How many groups of ${b} can fit into ${a}?"`,
          `If you have a debt of ${Math.abs(a)}, and each payment is a debt of ${Math.abs(b)}, how many payments is that?`,
          `Exactly ${result} groups! A count of groups is always a positive number.`,
        ],
        subBalloonExplanation: [
          `Target depth: ${a}m underwater.`,
          `Each anchor cable lowers you by ${b}m.`,
          `You need exactly ${result} cables to reach that depth.`,
        ],
        numberLineExplanation: [
          `Division is the reverse of multiplication:`,
          `Since ${result} × (${b}) = ${a},`,
          `it follows that (${a}) ÷ (${b}) = ${result}!`,
        ],
        patternProof: [
          `Check using multiplication:`,
          `[ ? ] × (${b}) = ${a}`,
          `Since positive ${result} × (${b}) = ${a}, the answer must be +${result}.`,
        ],
      };
    } else if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      return {
        headline: `Negative ÷ Positive: ${a} ÷ ${b} = ${result}`,
        ruleSummary: `Dividing numbers with DIFFERENT signs ALWAYS yields a NEGATIVE result: (-) ÷ (+) = (-) or (+) ÷ (-) = (-).`,
        counterExplanation: [
          `Dividing a total debt of ${Math.abs(Math.min(a, b))} into ${Math.max(a, b)} equal shares.`,
          `Each share receives a debt of ${Math.abs(result)}, which is ${result}.`,
        ],
        subBalloonExplanation: [
          `Spreading an altitude change of ${a}m across ${b} equal engine burns gives ${result}m per burn.`,
        ],
        numberLineExplanation: [
          `Inverse check: (${result}) × ${b} = ${a}.`,
          `Therefore ${a} ÷ ${b} = ${result}.`,
        ],
      };
    } else {
      return {
        headline: `Positive ÷ Positive: ${a} ÷ ${b} = ${result}`,
        ruleSummary: `Dividing positive quantities yields a positive quotient.`,
        counterExplanation: [`Splitting ${a} positives into ${b} equal groups yields ${result} per group.`],
        subBalloonExplanation: [`Ascending ${a}m in ${b} stages = ${result}m per stage.`],
        numberLineExplanation: [`${b} jumps of size ${result} covers distance ${a}.`],
      };
    }
  }

  return {
    headline: `${a} ${op} ${b} = ${result}`,
    ruleSummary: `Calculated result: ${result}`,
    counterExplanation: [],
    subBalloonExplanation: [],
    numberLineExplanation: [],
  };
}

// 8 Submarine Missions
export const SUBMARINE_MISSIONS: SubmarineMission[] = [
  {
    id: 1,
    title: 'Mission 1: The Shallow Reef',
    briefing: 'Descend from the surface (0m) to inspect the coral reef at -8m depth. Use your ballast card.',
    startingDepth: 0,
    targetDepth: -8,
    fuelLimit: 2,
    cards: [
      { id: 'c1', label: '+ (-8)', operation: '+', value: -8 },
      { id: 'c2', label: '+ (+5)', operation: '+', value: 5 },
      { id: 'c3', label: '- (-4)', operation: '-', value: -4 },
    ],
    hint: 'Adding a negative weight sinks the submarine down by that amount.',
  },
  {
    id: 2,
    title: 'Mission 2: Submerged Cavern',
    briefing: 'You are currently at -15m. A cavern entrance opened at -7m. How can you rise +8m using subtraction of a negative?',
    startingDepth: -15,
    targetDepth: -7,
    fuelLimit: 2,
    cards: [
      { id: 'c4', label: '- (-8)', operation: '-', value: -8 },
      { id: 'c5', label: '+ (-8)', operation: '+', value: -8 },
      { id: 'c6', label: '- (+10)', operation: '-', value: 10 },
    ],
    hint: 'Subtracting a negative removes ballast, which makes the sub RISE (+)!',
  },
  {
    id: 3,
    title: 'Mission 3: Underwater Volcano Trench',
    briefing: 'Start at -5m. We need to reach the hydrothermal vent at -25m in two steps.',
    startingDepth: -5,
    targetDepth: -25,
    fuelLimit: 3,
    cards: [
      { id: 'c7', label: '+ (-12)', operation: '+', value: -12 },
      { id: 'c8', label: '+ (-8)', operation: '+', value: -8 },
      { id: 'c9', label: '- (-10)', operation: '-', value: -10 },
      { id: 'c10', label: '+ (-5)', operation: '+', value: -5 },
    ],
    hint: '-5 + (-12) = -17, then what gets you to -25?',
  },
  {
    id: 4,
    title: 'Mission 4: Emergency Ascent to Surface Dock',
    briefing: 'You are deep at -30m. Emergency thrusters can multiply or subtract ballast to reach surface dock at 0m!',
    startingDepth: -30,
    targetDepth: 0,
    fuelLimit: 3,
    cards: [
      { id: 'c11', label: '- (-20)', operation: '-', value: -20 },
      { id: 'c12', label: '- (-10)', operation: '-', value: -10 },
      { id: 'c13', label: '+ (-15)', operation: '+', value: -15 },
      { id: 'c14', label: '× (+1)', operation: '×', value: 1 },
    ],
    hint: 'Two ballast releases: -(-20) gives +20, then -(-10) gives +10! -30 + 20 + 10 = 0.',
  },
  {
    id: 5,
    title: 'Mission 5: The Inversion Propeller',
    briefing: 'Depth is -6m. The mysterious inversion vortex multiplies your position by (-3)! Where will you land?',
    startingDepth: -6,
    targetDepth: 18,
    fuelLimit: 2,
    cards: [
      { id: 'c15', label: '× (-3)', operation: '×', value: -3 },
      { id: 'c16', label: '× (+2)', operation: '×', value: 2 },
      { id: 'c17', label: '+ (-5)', operation: '+', value: -5 },
    ],
    hint: 'A negative depth (-6) multiplied by a negative (-3) flips to a POSITIVE altitude (+18)!',
  },
  {
    id: 6,
    title: 'Mission 6: Division Chamber',
    briefing: 'Depth is -36m. The compression valve divides your depth by (-4). Reach the aerial launch ramp!',
    startingDepth: -36,
    targetDepth: 9,
    fuelLimit: 2,
    cards: [
      { id: 'c18', label: '÷ (-4)', operation: '÷', value: -4 },
      { id: 'c19', label: '÷ (+3)', operation: '÷', value: 3 },
      { id: 'c20', label: '- (-15)', operation: '-', value: -15 },
    ],
    hint: '(-36) ÷ (-4) = +9 because both signs are negative!',
  },
  {
    id: 7,
    title: 'Mission 7: The Double Negative Gauntlet',
    briefing: 'Start at -12m. Reach the observation pod at -2m using exactly two consecutive maneuvers.',
    startingDepth: -12,
    targetDepth: -2,
    fuelLimit: 2,
    cards: [
      { id: 'c21', label: '- (-15)', operation: '-', value: -15 },
      { id: 'c22', label: '+ (-5)', operation: '+', value: -5 },
      { id: 'c23', label: '- (+8)', operation: '-', value: 8 },
      { id: 'c24', label: '+ (+4)', operation: '+', value: 4 },
    ],
    hint: '-12 - (-15) = +3, and +3 + (-5) = -2!',
  },
  {
    id: 8,
    title: 'Mission 8: Master Navigator of the Abyss',
    briefing: 'Start at -48m in the deepest abyss. Pilot precisely to +16m using combined operations.',
    startingDepth: -48,
    targetDepth: 16,
    fuelLimit: 3,
    cards: [
      { id: 'c25', label: '÷ (-3)', operation: '÷', value: -3 },
      { id: 'c26', label: '+ (-10)', operation: '+', value: -10 },
      { id: 'c27', label: '- (-10)', operation: '-', value: -10 },
      { id: 'c28', label: '× (-1)', operation: '×', value: -1 },
    ],
    hint: 'First: (-48) ÷ (-3) = +16! That takes you right there in one move, or check the other combinations!',
  },
];

// Alchemist Levels for Zero-Pair Puzzle
export const ALCHEMIST_LEVELS: AlchemistLevel[] = [
  {
    id: 1,
    title: 'Apprentice: The First Neutralization',
    targetNetCharge: 0,
    initialPositives: 4,
    initialNegatives: 4,
    allowAddZeroPair: false,
    allowRemovePositives: false,
    allowRemoveNegatives: false,
    instruction: 'Drag positive (+) counters onto negative (-) counters to form Zero Pairs and clear the charge to 0!',
    storyExplanation: 'Every +1 and -1 cancel out perfectly. 4 + (-4) = 0.',
  },
  {
    id: 2,
    title: 'Level 2: Surplus Positive Charge',
    targetNetCharge: 3,
    initialPositives: 6,
    initialNegatives: 3,
    allowAddZeroPair: false,
    allowRemovePositives: false,
    allowRemoveNegatives: false,
    instruction: 'Pair up the opposing charges. What is the net surplus charge remaining?',
    storyExplanation: '6 + (-3) = 3 because 3 zero-pairs dissolve, leaving 3 positive charges.',
  },
  {
    id: 3,
    title: 'Level 3: Deep Negative Deficit',
    targetNetCharge: -4,
    initialPositives: 2,
    initialNegatives: 6,
    allowAddZeroPair: false,
    allowRemovePositives: false,
    allowRemoveNegatives: false,
    instruction: 'Form all possible zero pairs. Notice which sign has the larger absolute quantity!',
    storyExplanation: '2 + (-6) = -4. Since 6 > 2, the negative sign wins!',
  },
  {
    id: 4,
    title: 'Level 4: The Zero-Pair Catalyst (Subtracting a Negative)',
    targetNetCharge: 5,
    initialPositives: 2,
    initialNegatives: 0,
    allowAddZeroPair: true,
    allowRemovePositives: true,
    allowRemoveNegatives: true,
    instruction: 'Solve 2 - (-3): You start with 2 positives. You must remove 3 negatives, but none exist! Add 3 Zero Pairs, then vaporize the 3 negatives!',
    storyExplanation: 'When you bring in 3 zero pairs and remove the 3 negatives, 3 new positives remain! That is why 2 - (-3) = 2 + 3 = 5!',
  },
  {
    id: 5,
    title: 'Level 5: Subtracting Positives into the Negative',
    targetNetCharge: -3,
    initialPositives: 1,
    initialNegatives: 0,
    allowAddZeroPair: true,
    allowRemovePositives: true,
    allowRemoveNegatives: true,
    instruction: 'Solve 1 - 4: You have 1 positive, but need to remove 4 positives! Add Zero Pairs, then remove 4 positives.',
    storyExplanation: '1 - 4 = -3. Adding zero pairs lets you extract what you do not have, leaving the opposite behind.',
  },
  {
    id: 6,
    title: 'Level 6: Removing Debt: (-3) - (-5)',
    targetNetCharge: 2,
    initialPositives: 0,
    initialNegatives: 3,
    allowAddZeroPair: true,
    allowRemovePositives: true,
    allowRemoveNegatives: true,
    instruction: 'Start with 3 negatives (-3). You need to take away 5 negatives. Add 2 zero pairs, then remove 5 negatives!',
    storyExplanation: '(-3) - (-5) = +2! Relieving 5 units of debt from 3 units of debt leaves you with 2 units of profit!',
  },
];

// Matrix Puzzles (KenKen style with negative numbers)
export const MATRIX_PUZZLES: MatrixPuzzle[] = [
  {
    id: 1,
    title: 'Puzzle 1: Sign Shifter (2x2 Core)',
    size: 3,
    rowTargets: [
      { op: '×', target: -6 },   // e.g. 2 * (-3) * 1 = -6
      { op: '+', target: -1 },   // e.g. -4 + 2 + 1 = -1
      { op: '×', target: 8 },    // e.g. -2 * -4 * -1 = -8 or 4 * 2 * 1 = 8
    ],
    colTargets: [
      { op: '+', target: 0 },
      { op: '×', target: 24 },
      { op: '+', target: 3 },
    ],
    initialGrid: [
      [2, -3, 1],
      [-4, null, 1],
      [2, -4, null],
    ],
    solution: [
      [2, -3, 1],
      [-4, 2, 1],
      [2, -4, 1],
    ],
    allowedNumbers: [-4, -3, -2, -1, 1, 2, 3, 4],
  },
  {
    id: 2,
    title: 'Puzzle 2: Negative Multiplier Maze',
    size: 3,
    rowTargets: [
      { op: '×', target: 12 },   // (-3) * (-2) * 2 = 12
      { op: '+', target: -5 },   // (-4) + (-2) + 1 = -5
      { op: '×', target: -18 },  // (-3) * 3 * 2 = -18
    ],
    colTargets: [
      { op: '×', target: -36 },  // (-3) * (-4) * (-3) = -36
      { op: '×', target: 12 },   // (-2) * (-2) * 3 = 12
      { op: '+', target: 5 },    // 2 + 1 + 2 = 5
    ],
    initialGrid: [
      [-3, -2, 2],
      [-4, null, 1],
      [null, 3, 2],
    ],
    solution: [
      [-3, -2, 2],
      [-4, -2, 1],
      [-3, 3, 2],
    ],
    allowedNumbers: [-4, -3, -2, 1, 2, 3],
  },
];

// Streak arena questions
export interface QuizQuestion {
  id: string;
  a: number;
  op: Operation;
  b: number;
  correctAnswer: number;
  choices: number[];
  misconceptionTip: string;
}

export function generateStreakQuestion(): QuizQuestion {
  const operations: Operation[] = ['+', '-', '×', '÷'];
  const op = operations[Math.floor(Math.random() * operations.length)];

  let a = 0;
  let b = 0;
  let correctAnswer = 0;
  let misconceptionTip = '';

  if (op === '+') {
    const signs = Math.random() > 0.5 ? [-1, 1] : [-1, -1];
    a = (Math.floor(Math.random() * 9) + 1) * signs[0];
    b = (Math.floor(Math.random() * 9) + 1) * signs[1];
    correctAnswer = a + b;
    if (a < 0 && b < 0) {
      misconceptionTip = `Adding two negatives means combining debts: -(${Math.abs(a)} + ${Math.abs(b)}) = ${correctAnswer}.`;
    } else {
      misconceptionTip = `Opposite signs subtract in magnitude: ${Math.abs(a)} and ${Math.abs(b)} differ by ${Math.abs(correctAnswer)}. The bigger number gives its sign!`;
    }
  } else if (op === '-') {
    a = (Math.floor(Math.random() * 12) - 6);
    b = -(Math.floor(Math.random() * 8) + 1); // always subtract a negative
    correctAnswer = a - b;
    misconceptionTip = `Subtracting a negative is like adding a positive! ${a} - (${b}) = ${a} + ${Math.abs(b)} = ${correctAnswer}.`;
  } else if (op === '×') {
    const signs = Math.random() > 0.5 ? [-1, -1] : [-1, 1];
    a = (Math.floor(Math.random() * 8) + 2) * signs[0];
    b = (Math.floor(Math.random() * 8) + 2) * signs[1];
    correctAnswer = a * b;
    if (signs[0] === -1 && signs[1] === -1) {
      misconceptionTip = `Two negatives multiplied ALWAYS make a positive! (-) × (-) = (+). So (${a}) × (${b}) = +${correctAnswer}.`;
    } else {
      misconceptionTip = `Opposite signs multiplied ALWAYS yield a negative result! (+) × (-) = (-). So ${a} × ${b} = ${correctAnswer}.`;
    }
  } else {
    // Division
    const divisor = (Math.floor(Math.random() * 7) + 2) * (Math.random() > 0.5 ? -1 : 1);
    const quotient = (Math.floor(Math.random() * 7) + 2) * (Math.random() > 0.5 ? -1 : 1);
    b = divisor;
    a = quotient * divisor;
    correctAnswer = quotient;
    if (a < 0 && b < 0) {
      misconceptionTip = `Negative divided by negative is ALWAYS positive! (${a}) ÷ (${b}) = +${correctAnswer}.`;
    } else {
      misconceptionTip = `Dividing numbers with different signs is ALWAYS negative! ${a} ÷ ${b} = ${correctAnswer}.`;
    }
  }

  // Generate plausible distractor answers
  const distractors = new Set<number>();
  distractors.add(-correctAnswer); // common sign flip error
  distractors.add(correctAnswer + 1);
  distractors.add(correctAnswer - 1);
  distractors.add(correctAnswer + 2);
  distractors.delete(correctAnswer);

  const choicesList = Array.from(distractors).slice(0, 3);
  choicesList.push(correctAnswer);
  // Shuffle choices
  choicesList.sort(() => Math.random() - 0.5);

  return {
    id: `${Date.now()}-${Math.random()}`,
    a,
    op,
    b,
    correctAnswer,
    choices: choicesList,
    misconceptionTip,
  };
}
