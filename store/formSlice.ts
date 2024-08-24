import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  answers: Record<string, string>;
}

const initialState: FormState = {
  answers: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ id: string; value: string }>) => {
      state.answers[action.payload.id] = action.payload.value;
    },
    resetForm: (state) => {
      state.answers = {};
    },
  },
});

export const { setAnswer, resetForm } = formSlice.actions;
export default formSlice.reducer;