import { StateCreator } from 'zustand';
import { CounterSlice, CounterState } from '@/store/types/counter.type';
import { OmitProperties } from '@/utils/type-factory';

type SetState = (fn: (state: CounterSlice) => CounterSlice) => void;

const createActions = (set: SetState) => ({
  increment: () =>
    set((state: CounterSlice) => ({
      counterState: {
        ...state.counterState,
        count: state.counterState.count + 1,
      },
    })),

  decrement: () =>
    set((state: CounterSlice) => ({
      counterState: {
        ...state.counterState,
        count: state.counterState.count - 1,
      },
    })),

  reset: () =>
    set((state: CounterSlice) => ({
      counterState: {
        ...state.counterState,
        count: 0,
      },
    })),

  incrementBy: (value: number) =>
    set((state: CounterSlice) => ({
      counterState: {
        ...state.counterState,
        count: state.counterState.count + value,
      },
    })),
});

type ActionKeys = 'increment' | 'decrement' | 'reset' | 'incrementBy';
const initialState: OmitProperties<CounterState, ActionKeys> = {
  count: 0,
};

export const createCounterSlice: StateCreator<CounterSlice> = set => {
  const actions = createActions(set);

  return {
    counterState: {
      ...initialState,
      ...actions,
    },
  };
};
