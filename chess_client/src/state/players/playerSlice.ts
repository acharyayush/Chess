import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { capturedPiecesAndNumberType } from '../../types';
export interface PlayerState {
  whiteNetScore: number;
  capturedPiecesByWhite: capturedPiecesAndNumberType;
  capturedPiecesByBlack: capturedPiecesAndNumberType;
}
const initialState: PlayerState = {
  whiteNetScore: 0,
  capturedPiecesByWhite: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  capturedPiecesByBlack: { p: 0, n: 0, b: 0, r: 0, q: 0 },
};
const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
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
    resetPlayers: (state)=>{
      Object.assign(state, initialState)
    }
  },
});
export const {
  setWhiteNetScore,
  setCapturedPiecesByWhite,
  setCapturedPiecesByBlack,
  resetPlayers
} = playerSlice.actions;
export default playerSlice.reducer;
