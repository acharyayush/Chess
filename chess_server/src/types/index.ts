import {PieceSymbol } from "chess.js";
import { Socket } from "socket.io";

export type Move = {
    from: string;
    to: string;
    promotion?: PieceSymbol;
  };
export type Player = {
  socket: Socket;
  name: string;
}
export type PieceSymbolExcludingKing = Exclude<PieceSymbol, 'k'>;
export type capturedPiecesAndNumberType = Record<
  PieceSymbolExcludingKing,
  number
>;
export type CapturedDetails = {
  whiteNetScore: number,
  capturedPiecesByWhite: capturedPiecesAndNumberType,
  capturedPiecesByBlack: capturedPiecesAndNumberType,
}
