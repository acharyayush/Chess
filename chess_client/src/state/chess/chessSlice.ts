import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLegalMoves, isValidMove } from '../../utils/utils';
import {
  BLACK,
  Chess,
  Color,
  PAWN,
  PieceSymbol,
  Square,
  WHITE,
} from 'chess.js';
import React from 'react';
import { Mode, Move, updateMovePayload } from '../../types';
import socket from '../../socket';
import { SEND_MOVE } from '../../events';
export type ChessState = {
  chess: Chess;
  fen: string;
  flag: string;
  moveHistory: string[];
  board: ReturnType<Chess['board']>;
  turn: Color;
  legalMoves: string[];
  undo: boolean;
  showLegalMoves: boolean;
  enableTimer: boolean;
  move: Move;
  aiMove: string;
  showPromotionOption: { canShow: boolean; position?: string };
  promotion: PieceSymbol | null;
  mode: Mode;
  prevMove: Move;
  botDepth: number;
  worker: Worker | null;
};

const initialState: ChessState = {
  chess: new Chess(),
  moveHistory: [],
  fen: '',
  flag: '',
  board: [],
  turn: WHITE,
  legalMoves: [],
  undo: false,
  showLegalMoves: true,
  enableTimer: true,
  move: { from: '', to: '' },
  aiMove: '',
  showPromotionOption: { canShow: false },
  promotion: null,
  mode: 'offline',
  prevMove: { from: '', to: '' },
  botDepth: 1,
  worker: null,
};
const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    setChess: (state, action: PayloadAction<Chess>) => {
      state.chess = action.payload;
    },
    setBotDepth: (state, action: PayloadAction<number>) => {
      state.botDepth = action.payload;
    },
    setMoveHistory: (state, action: PayloadAction<string[]>) => {
      state.moveHistory = action.payload;
    },
    setBoard: (state, action: PayloadAction<ReturnType<Chess['board']>>) => {
      state.board = action.payload;
    },
    setFen: (state, action: PayloadAction<string>) => {
      state.fen = action.payload;
    },
    setFlag: (state, action: PayloadAction<string>) => {
      state.flag = action.payload;
    },
    setTurn: (state, action: PayloadAction<Color>) => {
      state.turn = action.payload;
    },
    toggleTurn: (state) => {
      state.turn = state.turn == WHITE ? BLACK : WHITE;
    },
    setLegalMoves: (state, action: PayloadAction<string[]>) => {
      state.legalMoves = action.payload;
    },
    setUndo: (state, action: PayloadAction<boolean>) => {
      state.undo = action.payload;
    },
    setShowLegalMoves: (state, action: PayloadAction<boolean>) => {
      state.showLegalMoves = action.payload;
      if (state.showLegalMoves && state.move.from) {
        if (state.fen) state.chess.load(state.fen);
        state.legalMoves = getLegalMoves(
          state.chess as Chess,
          state.move.from as Square,
          state.turn
        );
      }
    },
    setEnableTimer: (state, action: PayloadAction<boolean>) => {
      state.enableTimer = action.payload;
    },
    setShowPromotionOption: (
      state,
      { payload }: PayloadAction<{ canShow: boolean; position?: string }>
    ) => {
      state.showPromotionOption = payload;
    },
    setPromotion: (state, action: PayloadAction<PieceSymbol | null>) => {
      state.promotion = action.payload;
      if (state.promotion) {
        const moveToSet = {
          ...state.move,
          to: state.showPromotionOption?.position || '',
          promotion: state.promotion,
        };
        state.move = moveToSet;
        if (state.mode === 'online' && moveToSet.from && moveToSet.to)
          socket.emit(SEND_MOVE, moveToSet);
        state.promotion = null;
        return;
      }
    },
    setMove: (state, action: PayloadAction<Move>) => {
      state.move = action.payload;
    },
    setPrevMove: (state, action: PayloadAction<Move>) => {
      state.prevMove = action.payload;
    },
    resetAIMove: (state) => {
      state.aiMove = '';
    },
    resetMove: (state) => {
      state.move = { from: '', to: '' };
    },
    updateAIMove: (state, { payload }: PayloadAction<string>) => {
      state.aiMove = payload;
    },
    updateMove: (state, { payload }: PayloadAction<updateMovePayload>) => {
      //if promotion option is showing and user has clicked somewhere else in the board, then close it.
      if (state.showPromotionOption.canShow) {
        state.showPromotionOption.canShow = false;
      }
      //to update the key 'from', the selected piece must belong to active player
      //UPDATE FROM
      if (state.turn == payload.cell?.color) {
        state.move = { from: payload.cell.square, to: '' };
        if (state.showLegalMoves) {
          if (state.fen) state.chess.load(state.fen);
          state.legalMoves = getLegalMoves(
            state.chess as Chess,
            payload.position as Square,
            state.turn
          );
        }
        return;
      }

      //UPDATE TO
      state.legalMoves = [];
      const moveToSet = { ...state.move, to: payload.position };

      //To show promotion Option if pawn is at last position
      if (payload.position[1] == '1' || payload.position[1] == '8') {
        if (state.fen) state.chess.load(state.fen);
        const pieceToMove = state.chess.get(moveToSet.from as Square).type;
        //validation check
        if (
          pieceToMove == PAWN &&
          isValidMove(state.chess as Chess, state.fen, moveToSet)
        ) {
          state.showPromotionOption = {
            canShow: true,
            position: payload.position,
          };
          return;
        }
      }
      //Normal game move
      state.move = moveToSet;
      if (moveToSet.from && moveToSet.to) {
        if (state.mode === 'online') socket.emit(SEND_MOVE, moveToSet);
      }
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
    resetChess: (state) => {
      const mode = state.mode;
      const depth = state.botDepth;
      Object.assign(state, initialState);
      state.chess = new Chess();
      state.board = state.chess.board();
      state.mode = mode;
      state.botDepth = depth;
    },
    setWorker: (state, action: PayloadAction<Worker | null>) => {
      state.worker = action.payload;
    },
  },
});
export const {
  setChess,
  setMoveHistory,
  setBoard,
  setBotDepth,
  setFen,
  setFlag,
  setTurn,
  toggleTurn,
  setLegalMoves,
  setShowLegalMoves,
  setEnableTimer,
  setUndo,
  setPromotion,
  setShowPromotionOption,
  updateMove,
  updateAIMove,
  setMove,
  setPrevMove,
  resetMove,
  resetAIMove,
  setMode,
  resetChess,
  setWorker
} = chessSlice.actions;
export default chessSlice.reducer;
