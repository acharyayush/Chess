import { Color, PieceSymbol } from "chess.js";
import { Socket } from "socket.io";

export type Move = {
    from: string;
    to: string;
    promotion?: PieceSymbol;
  };