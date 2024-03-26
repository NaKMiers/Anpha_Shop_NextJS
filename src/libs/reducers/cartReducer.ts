import { FullyCartItem } from '@/app/api/cart/route'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const cart = createSlice({
  name: 'cart',
  initialState: {
    items: [] as FullyCartItem[],
    localItems: JSON.parse(localStorage.getItem('localCart') ?? '[]') as FullyCartItem[],
  },
  reducers: {
    // database cart
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

    // local cart
    setLocalCartItems: (state, action: PayloadAction<FullyCartItem[]>) => {
      // set localStorage
      localStorage.setItem('localCart', JSON.stringify(action.payload))

      return {
        ...state,
        localItems: action.payload,
      }
    },
    addLocalCartItem: (state, action: PayloadAction<FullyCartItem>) => {
      // if cart item has already existed in cart -> increase quantity
      const existedCartItem = state.localItems.find(item => item._id === action.payload._id)
      if (existedCartItem) {
        // update localStorage
        localStorage.setItem(
          'localCart',
          JSON.stringify(
            state.localItems.map(item =>
              item._id === action.payload._id ? { ...item, quantity: action.payload.quantity } : item
            )
          )
        )

        return {
          ...state,
          localItems: state.localItems.map(item =>
            item._id === action.payload._id ? { ...item, quantity: action.payload.quantity } : item
          ),
        }
      }

      // update localStorage
      localStorage.setItem('localCart', JSON.stringify([...state.localItems, action.payload]))

      // if cart item does not exist in cart -> add to cart
      return {
        ...state,
        localItems: [...state.localItems, action.payload],
      }
    },
    deleteLocalCartItem: (state, action: PayloadAction<string>) => {
      // update localStorage
      localStorage.setItem(
        'localCart',
        JSON.stringify(state.localItems.filter(item => item._id !== action.payload))
      )

      return {
        ...state,
        localItems: state.localItems.filter(item => item._id !== action.payload),
      }
    },
    updateLocalCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      // update localStorage
      localStorage.setItem(
        'localCart',
        JSON.stringify(
          state.localItems.map(item =>
            item._id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
          )
        )
      )

      return {
        ...state,
        localItems: state.localItems.map(item =>
          item._id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      }
    },
  },
})

export const {
  setCartItems,
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,
  setLocalCartItems,
  addLocalCartItem,
  deleteLocalCartItem,
  updateLocalCartItemQuantity,
} = cart.actions
export default cart.reducer
