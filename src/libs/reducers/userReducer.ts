import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {
    currentUser: {
      name: '',
      email: '',
    },
  },
  reducers: {
    changeCurrentUser: (state, action: PayloadAction<{ name: string; email: string }>) => ({
      ...state,
      currentUser: {
        name: action.payload.name,
        email: action.payload.email,
      },
    }),
  },
})

export const { changeCurrentUser } = user.actions
export default user.reducer
