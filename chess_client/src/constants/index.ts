import { PieceSymbolExcludingKing } from '../types';
export const piecesPoints: Record<PieceSymbolExcludingKing, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};
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
