import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types';
export interface messageState {
  messages: Message[];
}
const initialState: messageState = {
  messages: [],
};
const messageSlice = createSlice({
  initialState,
  name: 'messages',
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },
    resetMessages: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { addMessage, resetMessages } = messageSlice.actions;
export default messageSlice.reducer;
