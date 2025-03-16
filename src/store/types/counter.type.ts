import { StateCreator } from 'zustand';
import { RootState } from '@/store/types';

export interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementBy: (value: number) => void;
}

export interface CounterSlice {
  counterState: CounterState;
}

export type CounterSliceCreator = StateCreator<RootState, [], [], CounterSlice>;
