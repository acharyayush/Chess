import { configureStore } from '@reduxjs/toolkit';
import gameStatusReducer from './gameStatus/gameStatusSlice';
import playersReducer from './players/playerSlice';
import chessReducer from './chess/chessSlice';
import analysisReducer from './analysis/analysisSlice';
export const store = configureStore({
  reducer: {
    gameStatus: gameStatusReducer,
    players: playersReducer,
    chess: chessReducer,
    analysis: analysisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload'],
        // Ignore these paths in the state
        ignoredPaths: ['chess'],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
