import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const loading = createSlice({
  name: 'loading',
  initialState: {
    isOpenConfirm: false,
    isPageLoading: false,
    isLoading: false,
  },
  reducers: {
    setOpenConfirm: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isOpenConfirm: action.payload,
    }),
    setPageLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isPageLoading: action.payload,
    }),
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
  },
})

export const { setOpenConfirm, setPageLoading, setLoading } = loading.actions
export default loading.reducer
