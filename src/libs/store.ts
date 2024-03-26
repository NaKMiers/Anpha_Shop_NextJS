import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './reducers/cartReducer'
import modalReducer from './reducers/modalReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
      cart: cartReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
