import { AnyAction } from 'redux'
import { RootState } from './store'
import { ThunkAction } from "@reduxjs/toolkit"

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>