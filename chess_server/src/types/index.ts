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
