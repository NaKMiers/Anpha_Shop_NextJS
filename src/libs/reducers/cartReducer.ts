import { FullyCartItem } from '@/app/api/cart/route'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a function to access localStorage safely
const getLocalCartItems = (): FullyCartItem[] => {
  if (typeof window !== 'undefined') {
    // Access localStorage only if window (browser) is defined
    return JSON.parse(localStorage.getItem('localCart') ?? '[]') as FullyCartItem[]
  } else {
    // Return empty array if running on server-side or in environments where localStorage is not available
    return []
  }
}

export const cart = createSlice({
  name: 'cart',
  initialState: {
    items: [] as FullyCartItem[],
    localItems: getLocalCartItems(),
    selectedItems: [] as FullyCartItem[],
  },
  reducers: {
    // database cart
    setCartItems: (state, action: PayloadAction<FullyCartItem[]>) => {
      return {
        ...state,
        items: action.payload,
      }
    },
    addCartItem: (state, action: PayloadAction<FullyCartItem[]>) => {
      // Initialize an array to store updated items
      let updatedItems: FullyCartItem[] = [...state.items]

      // Loop through each item in the payload
      action.payload.forEach(item => {
        // Check if the item already exists in the cart
        const existingCartItemIndex = state.items.findIndex(cartItem => cartItem._id === item._id)

        // If the item exists, update its quantity
        if (existingCartItemIndex !== -1) {
          updatedItems[existingCartItemIndex] = item
        } else {
          // If the item does not exist, add it to the cart
          updatedItems.push(item)
        }
      })

      // Return the updated state with the new items
      return {
        ...state,
        items: updatedItems,
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
      console.log('action.payload: ', action.payload)

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

    // checkout
    setSelectedItems: (state, action: PayloadAction<FullyCartItem[]>) => {
      return {
        ...state,
        selectedItems: action.payload,
      }
    },
  },
})

export const {
  // database cart
  setCartItems,
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,

  // local cart
  setLocalCartItems,
  addLocalCartItem,
  deleteLocalCartItem,
  updateLocalCartItemQuantity,

  // checkout
  setSelectedItems,
} = cart.actions
export default cart.reducer
