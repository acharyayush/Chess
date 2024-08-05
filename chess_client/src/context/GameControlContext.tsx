import { Color, WHITE } from 'chess.js';
import { createContext, ReactNode, useEffect, useState } from 'react';
interface GameControlContextType {
  myPlayer: Color;
  showLegalMoves: boolean;
  playedMoves: string[];
  undo: boolean,
  rematch: boolean;
  hasResigned: boolean;
  setMyPlayer: React.Dispatch<React.SetStateAction<Color>>;
  setShowLegalMoves: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayedMoves: React.Dispatch<React.SetStateAction<string[]>>;
  setUndo: React.Dispatch<React.SetStateAction<boolean>>;
  setRematch: React.Dispatch<React.SetStateAction<boolean>>;
  setHasResigned: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}
const defaultValue = {
  myPlayer: WHITE as Color,
  showLegalMoves: true,
  playedMoves: [],
  undo: false,
  rematch: false,
  hasResigned: false,
  setMyPlayer: () => {},
  setShowLegalMoves: () => {},
  setPlayedMoves: () => {},
  setUndo: () => {},
  setRematch: () => {},
  setHasResigned: ()=>{},
};
export const GameControlContext =
  createContext<GameControlContextType>(defaultValue);
export function GameControlProvider({ children }: { children: ReactNode }) {
  const [myPlayer, setMyPlayer] = useState(defaultValue.myPlayer);
  const [showLegalMoves, setShowLegalMoves] = useState(
    defaultValue.showLegalMoves
  );
  const [playedMoves, setPlayedMoves] = useState<string[]>([]);
  const [undo, setUndo] = useState(defaultValue.undo);
  const [rematch, setRematch] = useState(defaultValue.rematch);
  const [hasResigned, setHasResigned] = useState(defaultValue.hasResigned);
  useEffect(() => {
    if (!rematch) return;
    //reset states
    setMyPlayer(defaultValue.myPlayer);
    setShowLegalMoves(defaultValue.showLegalMoves);
    setPlayedMoves(defaultValue.playedMoves);
    setUndo(defaultValue.undo);
    setRematch(defaultValue.rematch);
  }, [rematch]);
  return (
    <GameControlContext.Provider
      value={{
        myPlayer,
        showLegalMoves,
        playedMoves,
        undo,
        rematch,
        hasResigned,
        setMyPlayer,
        setShowLegalMoves,
        setPlayedMoves,
        setUndo,
        setRematch,
        setHasResigned,
      }}
    >
      {children}
    </GameControlContext.Provider>
  );
}
