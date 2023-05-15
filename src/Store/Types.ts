import { ThunkAction } from "@reduxjs/toolkit"
import { AnyAction } from 'redux'
import { RootState } from './store'

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>