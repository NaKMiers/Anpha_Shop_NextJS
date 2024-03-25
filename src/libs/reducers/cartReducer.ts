import { FullyCartItem } from '@/app/api/cart/route'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const cart = createSlice({
  name: 'cart',
  initialState: {
    items: [] as FullyCartItem[],
    length: 0,
  },
  reducers: {
    setCartItems: (state, action: PayloadAction<FullyCartItem[]>) => {
      return {
        ...state,
        items: action.payload,
      }
    },
    setCartLength: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        length: action.payload,
      }
    },
  },
})

export const { setCartItems, setCartLength } = cart.actions
export default cart.reducer
