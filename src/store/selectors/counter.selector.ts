import { useBoundStore } from '@/store';
import { CounterSlice } from '@/store/types/counter.type';

export const useCounterSelector = () => {
  const { count, increment, decrement, reset, incrementBy } = useBoundStore(
    (state: CounterSlice) => state.counterState
  );

  return {
    count,
    increment,
    decrement,
    reset,
    incrementBy,
  };
};
