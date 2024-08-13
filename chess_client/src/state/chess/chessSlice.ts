import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLegalMoves, isValidMove } from '../../utils/utils';
import { Chess, Color, PAWN, PieceSymbol, Square, WHITE } from 'chess.js';
import { Move, updateMovePayload } from '../../types';
export type ChessState = {
  chess: Chess;
  moveHistory: string[];
  board: ReturnType<Chess['board']>;
  turn: Color;
  legalMoves: string[];
  undo: boolean;
  showLegalMoves: boolean;
  move: Move;
  showPromotionOption: { canShow: boolean; position?: string };
  promotion: PieceSymbol | null;
};

const initialState: ChessState = {
  chess: new Chess(),
  moveHistory: [],
  board: [],
  turn: WHITE,
  legalMoves: [],
  undo: false,
  showLegalMoves: true,
  move: { from: '', to: '' },
  showPromotionOption: { canShow: false },
  promotion: null,
};
const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    setChess: (state, action: PayloadAction<Chess>) => {
      state.chess = action.payload;
    },
    setMoveHistory: (state, action: PayloadAction<string[]>) => {
      state.moveHistory = action.payload;
    },
    setBoard: (state, action: PayloadAction<ReturnType<Chess['board']>>) => {
      state.board = action.payload;
    },
    setTurn: (state, action: PayloadAction<Color>) => {
      state.turn = action.payload;
    },
    setLegalMoves: (state, action: PayloadAction<string[]>) => {
      state.legalMoves = action.payload;
    },
    setUndo: (state, action: PayloadAction<boolean>) => {
      state.undo = action.payload;
    },
    setShowLegalMoves: (state, action: PayloadAction<boolean>) => {
      state.showLegalMoves = action.payload;
      if(state.showLegalMoves && state.move.from){
        state.legalMoves = getLegalMoves(state.chess as Chess, state.move.from as Square, state.turn)
      }
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
        let moveToSet = {
          ...state.move,
          to: state.showPromotionOption?.position || '',
          promotion: state.promotion,
        };
        state.move = moveToSet;
        state.promotion = null;
        return;
      }
    },
    resetMove: (state) => {
      state.move = { from: '', to: '' };
    },
    updateMove: (state, { payload }: PayloadAction<updateMovePayload>) => {
      //to update 'from' the selected piece must belong to active player
      //UPDATE FROM
      if (state.turn == payload.cell?.color) {
        state.move = { from: payload.cell.square, to: '' };
        if (state.showLegalMoves) {
          state.legalMoves = getLegalMoves(state.chess as Chess, payload.position as Square, state.turn)
        }
        return;
      }

      //UPDATE TO
      state.legalMoves = [];
      let moveToSet = { ...state.move, to: payload.position };

      //To show promotion Option if pawn is at last position
      if (payload.position[1] == '1' || payload.position[1] == '8') {
        let pieceToMove = state.chess.get(moveToSet.from as Square).type;
        //validation check
        if (pieceToMove == PAWN && isValidMove(state.chess as Chess, moveToSet)) {
          state.showPromotionOption = {
            canShow: true,
            position: payload.position,
          };
          return;
        }
      }
      //Normal game move
      state.move = moveToSet;
    },
    resetChess: (state) => {
      Object.assign(state, initialState);
      state.chess = new Chess();
      state.board = state.chess.board()
    },
  },
});
export const {
  setChess,
  setMoveHistory,
  setBoard,
  setTurn,
  setLegalMoves,
  setShowLegalMoves,
  setUndo,
  setPromotion,
  setShowPromotionOption,
  updateMove,
  resetMove,
  resetChess,
} = chessSlice.actions;
export default chessSlice.reducer;
