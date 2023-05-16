import { decrement, increment } from "./Store/Slices/counterSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

import { ReactElement } from "react";
import { styled } from '@mui/material'

type ownPropsT = {
  data?: string;
}

const Test = ({ data }: ownPropsT): ReactElement => {
  const storeCount = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()
  const incrementStoreCount = () => dispatch(increment())
  const decrementStoreCount = () => dispatch(decrement())

  const StyledDiv = styled('div')(({ theme }) => ({
    color: theme.palette.secondary.main
  }))

  return (
    <div>
      <button onClick={incrementStoreCount}>increase</button>
      <button onClick={decrementStoreCount}>decrease</button>
      <StyledDiv>store count = {storeCount}</StyledDiv>
      <p>{data} for test component</p>
    </div>
  );
};

export default Test