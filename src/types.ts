export type Operation = '+' | '-' | '*' | '/';

export type GameMode = '1P' | '2P';

export interface Problem {
  num1: number;
  num2: number;
  op: Operation;
  answer: number;
  options: number[];
}

export interface GameState {
  screen: 'setup' | 'playing' | 'gameover';
  mode: GameMode;
  operations: Operation[];
  maxDigits: number;
  scores: number[];
  round: number;
  maxRounds: number;
}
