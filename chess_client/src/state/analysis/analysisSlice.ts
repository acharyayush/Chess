import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface AnalysisState {
  removeAnalysisStyle: boolean;
}
const initialState: AnalysisState = {
  removeAnalysisStyle: true,
};
const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setRemoveAnalysisStyle: (state, action: PayloadAction<boolean>) => {
      state.removeAnalysisStyle = action.payload;
    },
    resetAnalysis: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { setRemoveAnalysisStyle, resetAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;
