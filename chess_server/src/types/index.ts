import {PieceSymbol } from "chess.js";

export type Move = {
    from: string;
    to: string;
    promotion?: PieceSymbol;
  };