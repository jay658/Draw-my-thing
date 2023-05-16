import type { AppStore, RootState } from './mockStore'
import React, { PropsWithChildren } from 'react'

import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
// As a basic setup, import your same slice reducers
import counterReducer from '../../Store/Slices/counterSlice'
import { render } from '@testing-library/react'

//If we need to modify anything, refer to https://redux.js.org/usage/writing-tests

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: { counter: counterReducer }, preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}