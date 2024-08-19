import { PieceSymbolExcludingKing } from "../types";
export const piecesPoints: Record<PieceSymbolExcludingKing, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};
export const JOIN_GAME = "join_game"
export const INIT_GAME = "init_game"
export const SEND_MOVE = "send_move"
export const RECEIVE_MOVE = "receive_move"
    //library flags definition
    // const FLAGS: Record<string, string> = {
    //   NORMAL: 'n',
    //   CAPTURE: 'c',
    //   BIG_PAWN: 'b',
    //   EP_CAPTURE: 'e',
    //   PROMOTION: 'p',
    //   KSIDE_CASTLE: 'k',
    //   QSIDE_CASTLE: 'q',
    // }
