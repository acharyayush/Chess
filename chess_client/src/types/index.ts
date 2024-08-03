import { Color, PieceSymbol, Square } from 'chess.js';

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
export type updateMoveType = (
  cell: Cell,
  turn: Color,
  position: Square
) => void;
export interface CommonCellAndChessProps{
  turn: Color;
  activeSquare: Square,
  inCheck: boolean
  updateMove: updateMoveType;
}