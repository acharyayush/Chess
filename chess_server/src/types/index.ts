import { PieceSymbol } from 'chess.js';
import { Socket } from 'socket.io';
import Timer from '../Timer';

export type Move = {
  from: string;
  to: string;
  promotion?: PieceSymbol;
};
export type Player = {
  socket: Socket;
  timer: Timer;
  name: string;
};
export type PieceSymbolExcludingKing = Exclude<PieceSymbol, 'k'>;
export type capturedPiecesAndNumberType = Record<
  PieceSymbolExcludingKing,
  number
>;
export type CapturedDetails = {
  whiteNetScore: number;
  capturedPiecesByWhite: capturedPiecesAndNumberType;
  capturedPiecesByBlack: capturedPiecesAndNumberType;
};
export type Time = {
  minutes: number;
  seconds: number;
};
