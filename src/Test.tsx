import { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { increment, decrement } from "./Store/Slices/counterSlice";

const Test = (): ReactElement => {
  const storeCount = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()
  const incrementStoreCount = () => dispatch(increment())
  const decrementStoreCount = () => dispatch(decrement())
  return (
    <div>
      <button onClick={incrementStoreCount}>increase</button>
      <button onClick={decrementStoreCount}>decrease</button>
      <div>store count = {storeCount}</div>
    </div>
  );
};

export default Test