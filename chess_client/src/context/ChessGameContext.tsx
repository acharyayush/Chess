import { ReactNode } from 'react';
import { Chess, Color, PieceSymbol, Square, WHITE } from 'chess.js';
import { createContext, useState } from 'react';

interface ChessGameContextType {
  chess: Chess,
  myPlayer: Color,
  showPromotionOption: { canShow: boolean; position?: Square },
  promotion: PieceSymbol | null,
  showLegalMoves: boolean,
  legalMoves: Square[],
  isDragging: boolean,
  playedMoves: string[],
  setMyPlayer: React.Dispatch<React.SetStateAction<Color>>,
  setShowPromotionOption: React.Dispatch<
    React.SetStateAction<{
      canShow: boolean,
      position?: Square,
    }>
  >;
  setPromotion: React.Dispatch<React.SetStateAction<PieceSymbol | null>>,
  setShowLegalMoves: React.Dispatch<React.SetStateAction<boolean>>,
  setLegalMoves: React.Dispatch<React.SetStateAction<Square[]>>,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setPlayedMoves: React.Dispatch<React.SetStateAction<string[]>>,
}

const defaultValue = {
  //test positions of near the end of game: '8/8/3PK3/8/8/3pk3/8/8 w - - 0 1'
  chess: new Chess(),
  myPlayer: WHITE as Color,
  showPromotionOption: {canShow: false},
  promotion: null,
  showLegalMoves: true,
  legalMoves: [],
  isDragging: false,
  draggedImg: null,
  playedMoves: [],
  setShowPromotionOption: () => {},
  setPromotion: () => {},
  setMyPlayer: ()=>{} ,
  setShowLegalMoves: ()=>{},
  setLegalMoves: ()=>{},
  setIsDragging: ()=>{},
  setPlayedMoves: ()=>{},
};

export const ChessGameContext =
  createContext<ChessGameContextType>(defaultValue);

export function ChessGameProvider({ children }: { children: ReactNode }) {
  const [chess] = useState(defaultValue.chess);
  const [myPlayer, setMyPlayer] = useState(defaultValue.myPlayer)
  const [promotion, setPromotion] = useState<PieceSymbol | null>(null);
  const [showPromotionOption, setShowPromotionOption] = useState<{
    canShow: boolean;
    position?: Square;
  }>(defaultValue.showPromotionOption);
  const [showLegalMoves, setShowLegalMoves] = useState(defaultValue.showLegalMoves)
  const [legalMoves, setLegalMoves] = useState<Square[]>(defaultValue.legalMoves)
  const [isDragging, setIsDragging] = useState<boolean>(defaultValue.isDragging)
  const [playedMoves, setPlayedMoves] = useState<string[]>([])
  return (
    <ChessGameContext.Provider
      value={{
        chess,
        myPlayer,
        showPromotionOption,
        promotion,
        showLegalMoves,
        legalMoves,
        isDragging,
        playedMoves,
        setMyPlayer,
        setShowPromotionOption,
        setPromotion,
        setShowLegalMoves,
        setLegalMoves,
        setIsDragging,
        setPlayedMoves,
      }}
    >
      {children}
    </ChessGameContext.Provider>
  );
}
