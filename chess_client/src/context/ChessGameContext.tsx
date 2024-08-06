import React, { ReactNode, useContext, useEffect } from 'react';
import { Chess, PieceSymbol, Square } from 'chess.js';
import { createContext, useState } from 'react';
import { capturedPiecesAndNumberType, Move } from '../types';
import { GameControlContext } from './GameControlContext';

interface ChessGameContextType {
  chess: Chess;
  showPromotionOption: { canShow: boolean; position?: Square };
  promotion: PieceSymbol | null;
  legalMoves: Square[];
  isDragging: boolean;
  move: Move;
  whiteNetScore: number;
  capturedPiecesByWhite: capturedPiecesAndNumberType;
  capturedPiecesByBlack: capturedPiecesAndNumberType;
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
  setWhiteNetScore: React.Dispatch<React.SetStateAction<number>>;
  setCapturedPiecesByWhite: React.Dispatch<
    React.SetStateAction<capturedPiecesAndNumberType>
  >;
  setCapturedPiecesByBlack: React.Dispatch<
    React.SetStateAction<capturedPiecesAndNumberType>
  >;
}

const defaultValue = {
  //test positions of near the end of game: '8/1PQ5/5K1k/8/8/8/8/8 w - - 0 1'
  chess: new Chess(),
  showPromotionOption: { canShow: false },
  promotion: null,
  legalMoves: [],
  isDragging: false,
  draggedImg: null,
  move: { from: '', to: '' },
  whiteNetScore: 0,
  capturedPiecesByWhite: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  capturedPiecesByBlack: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  setShowPromotionOption: () => {},
  setPromotion: () => {},
  setLegalMoves: () => {},
  setIsDragging: () => {},
  setMove: () => {},
  setWhiteNetScore: () => {},
  setCapturedPiecesByWhite: () => {},
  setCapturedPiecesByBlack: () => {},
};

export const ChessGameContext =
  createContext<ChessGameContextType>(defaultValue);

export function ChessGameProvider({ children }: { children: ReactNode }) {
  const { rematch} = useContext(GameControlContext);
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
  const [whiteNetScore, setWhiteNetScore] = useState(
    defaultValue.whiteNetScore
  );
  const [capturedPiecesByWhite, setCapturedPiecesByWhite] = useState(
    defaultValue.capturedPiecesByWhite
  );
  const [capturedPiecesByBlack, setCapturedPiecesByBlack] = useState(
    defaultValue.capturedPiecesByBlack
  );

  useEffect(() => {
    if (!rematch) return;
    setChess(new Chess());
    setShowPromotionOption(defaultValue.showPromotionOption);
    setPromotion(defaultValue.promotion);
    setLegalMoves(defaultValue.legalMoves);
    setIsDragging(defaultValue.isDragging);
    setMove(defaultValue.move);
    setWhiteNetScore(defaultValue.whiteNetScore);
    setCapturedPiecesByWhite(defaultValue.capturedPiecesByWhite);
    setCapturedPiecesByBlack(defaultValue.capturedPiecesByBlack);
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
        whiteNetScore,
        capturedPiecesByWhite,
        setCapturedPiecesByWhite,
        setShowPromotionOption,
        setPromotion,
        setLegalMoves,
        setIsDragging,
        setMove,
        setWhiteNetScore,
        capturedPiecesByBlack,
        setCapturedPiecesByBlack,
      }}
    >
      {children}
    </ChessGameContext.Provider>
  );
}
