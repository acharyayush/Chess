import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Winner } from '../../types';

export interface gameStatusState {
  winner: Winner;
  isGameOver: boolean;
  hasResigned: boolean;
  gameOverDescription: string;
  isDraw: boolean;
  isCheck: boolean;
  rematch: boolean;
}
const initialState: gameStatusState = {
  winner: 'd',
  isGameOver: false,
  hasResigned: false,
  gameOverDescription: '',
  isDraw: false,
  isCheck: false,
  rematch: false,
};
const gameStatusSlice = createSlice({
  name: 'gameStatus',
  initialState,
  reducers: {
    setWinner: (state, action: PayloadAction<Winner>) => {
      state.winner = action.payload;
    },
    setIsGameOver: (state, action: PayloadAction<boolean>) => {
      state.isGameOver = action.payload;
    },
    setHasResigned: (state, action: PayloadAction<boolean>) => {
      state.hasResigned = action.payload;
    },
    setGameOverDescription: (state, action: PayloadAction<string>) => {
      state.gameOverDescription = action.payload;
    },
    setIsDraw: (state, action: PayloadAction<boolean>) => {
      state.isDraw = action.payload;
    },
    setIsCheck: (state, action: PayloadAction<boolean>) => {
      state.isCheck = action.payload;
    },
    setRematch: (state, action: PayloadAction<boolean>) => {
      state.rematch = action.payload;
    },
    resetGameStatus: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const {
  setWinner,
  setIsGameOver,
  setHasResigned,
  setGameOverDescription,
  setIsDraw,
  setIsCheck,
  setRematch,
  resetGameStatus,
} = gameStatusSlice.actions;
export default gameStatusSlice.reducer;
