import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const loading = createSlice({
  name: 'loading',
  initialState: {
    isPageLoading: false,
  },
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isPageLoading: action.payload,
    }),
  },
})

export const { setPageLoading } = loading.actions
export default loading.reducer
