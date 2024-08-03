import { Color, Square, WHITE } from "chess.js";

export default function extractPosition(move:string, turn: Color){
    if (move == 'O-O') {
        if (turn == WHITE) return 'g1';
        return 'g8';
      }
      if (move == 'O-O-O') {
        if (turn == WHITE) return 'c1';
        return 'c8';
      }
      let regex = /[a-h][1-9]/
      return move.match(regex)?.[0] as Square
}