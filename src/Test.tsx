import { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { increment, decrement } from "./Store/Slices/counterSlice";
import { styled } from '@mui/material'

const Test = (): ReactElement => {
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
    </div>
  );
};

export default Test