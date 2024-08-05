import React, { ReactNode, useContext, useEffect } from 'react';
import { Chess, PieceSymbol, Square } from 'chess.js';
import { createContext, useState } from 'react';
import { Move } from '../types';
import { GameControlContext } from './GameControlContext';

interface ChessGameContextType {
  chess: Chess;
  showPromotionOption: { canShow: boolean; position?: Square };
  promotion: PieceSymbol | null;
  legalMoves: Square[];
  isDragging: boolean;
  move: Move;
  setShowPromotionOption: React.Dispatch<
    React.SetStateAction<{
      canShow: boolean;
      position?: Square;
    }>
  >;
  setPromotion: React.Dispatch<React.SetStateAction<PieceSymbol | null>>;
  setLegalMoves: React.Dispatch<React.SetStateAction<Square[]>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setMove: React.Dispatch<React.SetStateAction<Move>>;
}

const defaultValue = {
  //test positions of near the end of game: '8/1PQ5/5K1k/8/8/8/8/8 w - - 0 1'
  chess: new Chess('8/1PQ5/5K1k/8/8/8/8/8 w - - 0 1'),
  showPromotionOption: { canShow: false },
  promotion: null,
  legalMoves: [],
  isDragging: false,
  draggedImg: null,
  move: { from: '', to: '' },
  setShowPromotionOption: () => {},
  setPromotion: () => {},
  setLegalMoves: () => {},
  setIsDragging: () => {},
  setMove: () => {},
};

export const ChessGameContext =
  createContext<ChessGameContextType>(defaultValue);

export function ChessGameProvider({ children }: { children: ReactNode }) {
  const { rematch } = useContext(GameControlContext);
  const [chess, setChess] = useState(defaultValue.chess);
  const [promotion, setPromotion] = useState<PieceSymbol | null>(null);
  const [showPromotionOption, setShowPromotionOption] = useState<{
    canShow: boolean;
    position?: Square;
  }>(defaultValue.showPromotionOption);
  const [legalMoves, setLegalMoves] = useState<Square[]>(
    defaultValue.legalMoves
  );
  const [isDragging, setIsDragging] = useState<boolean>(
    defaultValue.isDragging
  );
  const [move, setMove] = useState<Move>(defaultValue.move);

  useEffect(() => {
    if (!rematch) return;
    setChess(new Chess());
    setShowPromotionOption(defaultValue.showPromotionOption);
    setPromotion(defaultValue.promotion);
    setLegalMoves(defaultValue.legalMoves);
    setIsDragging(defaultValue.isDragging);
    setMove(defaultValue.move);
  }, [rematch]);
  return (
    <ChessGameContext.Provider
      value={{
        chess,
        showPromotionOption,
        promotion,
        legalMoves,
        isDragging,
        move,
        setShowPromotionOption,
        setPromotion,
        setLegalMoves,
        setIsDragging,
        setMove,
      }}
    >
      {children}
    </ChessGameContext.Provider>
  );
}
