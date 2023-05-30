import { combineReducers, configureStore } from '@reduxjs/toolkit'

import type { PreloadedState } from '@reduxjs/toolkit'
import { authSlice } from '../../Store/RTK/authSlice'
import counterReducer from '../../Store/Slices/counterSlice'
import { userSlice } from '../../Store/RTK/userSlice'

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  counter: counterReducer,
  [userSlice.reducerPath]: userSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware()
        .concat(userSlice.middleware)
        .concat(authSlice.middleware)
    },
    preloadedState
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']