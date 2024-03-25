import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from './reducers/loadingReducer'
import cartReducer from './reducers/cartReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
      loading: loadingReducer,
      cart: cartReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
