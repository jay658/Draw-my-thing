import { authSlice } from './RTK/authSlice'
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './Slices/counterSlice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { userSlice } from './RTK/userSlice'
// ...

//https://redux.js.org/usage/usage-with-typescript for instructions

export const store = configureStore({
  reducer: {
    // posts: postsReducer,
    // comments: commentsReducer,
    counter: counterReducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware()
      .concat(userSlice.middleware)
      .concat(authSlice.middleware)
  }
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
