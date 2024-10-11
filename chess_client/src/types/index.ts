import { Chess, Color, PieceSymbol, Square } from 'chess.js';

export type Board = ReturnType<Chess['board']>;
export type Winner = Color | 'd'; //d stands for draw
export type Move = {
  from: string;
  to: string;
  promotion?: PieceSymbol;
};
export type Cell = {
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null;
export type PieceSymbolExcludingKing = Exclude<PieceSymbol, 'k'>;
export type capturedPiecesAndNumberType = Record<
  PieceSymbolExcludingKing,
  number
>;
export type updateMoveType = (
  cell: Cell,
  turn: Color,
  position: Square
) => void;
export type updateMovePayload = {
  cell: Cell;
  position: string;
};
export type CapturedDetails = {
  whiteNetScore: number;
  capturedPiecesByWhite: capturedPiecesAndNumberType;
  capturedPiecesByBlack: capturedPiecesAndNumberType;
};
export type Time = {
  minutes: number;
  seconds: number;
};
export type INIT_GAME_TYPE = {
  mainPlayer: Color;
  fen: string;
  totalTime: number;
};
export type ArrowType = {
  start: HTMLDivElement;
  end: HTMLDivElement;
};
