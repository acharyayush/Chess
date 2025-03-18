import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { capturedPiecesAndNumberType } from '../../types';
import { Color, WHITE } from 'chess.js';
export interface PlayerState {
  player1: string;
  player2: string;
  player1LogoUrl: string;
  player2LogoUrl: string;
  mainPlayer: Color;
  whiteNetScore: number;
  totalTime: number;
  whiteTime: number;
  blackTime: number;
  capturedPiecesByWhite: capturedPiecesAndNumberType;
  capturedPiecesByBlack: capturedPiecesAndNumberType;
}
const initialState: PlayerState = {
  player1: 'White', //name of player, initially the color
  player2: 'Black',
  player1LogoUrl: '',
  player2LogoUrl: '',
  mainPlayer: WHITE,
  whiteNetScore: 0,
  totalTime: 10 * 60, //10 min
  whiteTime: 0,
  blackTime: 0,
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
    setPlayersLogoUrl: (
      state,
      action: PayloadAction<{ player1LogoUrl: string; player2LogoUrl: string }>
    ) => {
      state.player1LogoUrl = action.payload.player1LogoUrl;
      state.player2LogoUrl = action.payload.player2LogoUrl;
    },
    setTotalTime: (state, action: PayloadAction<number>) => {
      state.totalTime = action.payload;
      state.whiteTime = action.payload;
      state.blackTime = action.payload;
    },
    setWhiteTime: (state, action: PayloadAction<number>) => {
      state.whiteTime = action.payload;
    },
    decreaseWhiteTime: (state) => {
      state.whiteTime--;
    },
    setBlackTime: (state, action: PayloadAction<number>) => {
      state.blackTime = action.payload;
    },
    decreaseBlackTime: (state) => {
      state.blackTime--;
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
    setMainPlayer: (state, action: PayloadAction<Color>) => {
      state.mainPlayer = action.payload;
    },
    resetPlayers: (state) => {
      const constantStates = {
        player1: state.player1,
        player2: state.player2,
        player1LogoUrl: state.player1LogoUrl,
        player2LogoUrl: state.player2LogoUrl,
      };
      Object.assign(state, { ...initialState, ...constantStates });
    },
  },
});
export const {
  setPlayers,
  setPlayersLogoUrl,
  setWhiteNetScore,
  setCapturedPiecesByWhite,
  setCapturedPiecesByBlack,
  resetPlayers,
  setMainPlayer,
  setTotalTime,
  setWhiteTime,
  decreaseWhiteTime,
  setBlackTime,
  decreaseBlackTime,
} = playerSlice.actions;
export default playerSlice.reducer;
