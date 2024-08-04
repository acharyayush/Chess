import { Color, WHITE } from 'chess.js';
import { createContext, ReactNode, useEffect, useState } from 'react';
interface GameControlContextType {
  myPlayer: Color;
  showLegalMoves: boolean;
  playedMoves: string[];
  undo: { count: number };
  rematch: boolean;
  setMyPlayer: React.Dispatch<React.SetStateAction<Color>>;
  setShowLegalMoves: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayedMoves: React.Dispatch<React.SetStateAction<string[]>>;
  setUndo: React.Dispatch<React.SetStateAction<{ count: number }>>;
  setRematch: React.Dispatch<React.SetStateAction<boolean>>;
}
const defaultValue = {
  myPlayer: WHITE as Color,
  showLegalMoves: true,
  playedMoves: [],
  undo: { count: 0 },
  rematch: false,
  setMyPlayer: () => {},
  setShowLegalMoves: () => {},
  setPlayedMoves: () => {},
  setUndo: () => {},
  setRematch: () => {},
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
        setMyPlayer,
        setShowLegalMoves,
        setPlayedMoves,
        setUndo,
        setRematch,
      }}
    >
      {children}
    </GameControlContext.Provider>
  );
}
