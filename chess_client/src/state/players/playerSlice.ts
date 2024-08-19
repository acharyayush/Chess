import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { capturedPiecesAndNumberType } from '../../types';
import { Color, WHITE } from 'chess.js';
export interface PlayerState {
  player1: string;
  player2: string;
  mainPlayer: Color,
  whiteNetScore: number;
  capturedPiecesByWhite: capturedPiecesAndNumberType;
  capturedPiecesByBlack: capturedPiecesAndNumberType;
}
const initialState: PlayerState = {
  player1: 'White', //name of player, initially the color
  player2: 'Black',
  mainPlayer: WHITE,
  whiteNetScore: 0,
  capturedPiecesByWhite: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  capturedPiecesByBlack: { p: 0, n: 0, b: 0, r: 0, q: 0 },
};
const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers: (
      state,
      action: PayloadAction<{ player1: string; player2: string }>
    ) => {
      if (!action.payload.player1 || !action.payload.player2) return;
      state.player1 = action.payload.player1;
      state.player2 = action.payload.player2;
    },
    setWhiteNetScore: (state, action: PayloadAction<number>) => {
      state.whiteNetScore = action.payload;
    },
    setCapturedPiecesByWhite: (
      state,
      action: PayloadAction<capturedPiecesAndNumberType>
    ) => {
      state.capturedPiecesByWhite = action.payload;
    },
    setCapturedPiecesByBlack: (
      state,
      action: PayloadAction<capturedPiecesAndNumberType>
    ) => {
      state.capturedPiecesByBlack = action.payload;
    },
    setMainPlayer: (state, action:PayloadAction<Color>)=>{
      state.mainPlayer = action.payload;
    },
    resetPlayers: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const {
  setPlayers,
  setWhiteNetScore,
  setCapturedPiecesByWhite,
  setCapturedPiecesByBlack,
  resetPlayers,
  setMainPlayer
} = playerSlice.actions;
export default playerSlice.reducer;
