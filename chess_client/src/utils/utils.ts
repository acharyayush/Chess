import { Chess, Color, Square, WHITE } from 'chess.js';
import { Move } from '../types';

export function extractPosition(move: string, turn: Color) {
  if (move == 'O-O') {
    if (turn == WHITE) return 'g1';
    return 'g8';
  }
  if (move == 'O-O-O') {
    if (turn == WHITE) return 'c1';
    return 'c8';
  }
  const regex = /[a-h][1-9]/;
  return move.match(regex)?.[0] as Square;
}
export const isValidMove = (chess: Chess, fen: string, move: Move) => {
  const temp = fen ? new Chess(fen) : new Chess(chess.fen());
  try {
    //just to check if move is valid, queen is taken as promotion sample
    temp.move({ ...move, promotion: 'q' });
    return true;
  } catch (e) {
    //Tried to promote but move is not valid
    return false;
  }
};
export const getLegalMoves = (
  chess: Chess,
  fen: string,
  position: Square,
  turn: Color
) => {
  let tempChess: Chess;
  if (fen) tempChess = new Chess(fen);
  else tempChess = chess;

  return tempChess
    .moves({ square: position })
    .map((move) => extractPosition(move, turn));
};
