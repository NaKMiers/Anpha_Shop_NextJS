import { FullyCartItem } from '@/app/api/cart/route'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const cart = createSlice({
  name: 'cart',
  initialState: {
    localItems: [] as FullyCartItem[],
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
    addCartItem: (state, action: PayloadAction<FullyCartItem>) => {
      // if cart item has already existed in cart -> increase quantity
      const existedCartItem = state.items.find(item => item._id === action.payload._id)
      if (existedCartItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id ? { ...item, quantity: action.payload.quantity } : item
          ),
        }
      }

      // if cart item does not exist in cart -> add to cart
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    },
    deleteCartItem: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      }
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      }
    },
  },
})

export const { setCartItems, addCartItem, deleteCartItem, updateCartItemQuantity } = cart.actions
export default cart.reducer
