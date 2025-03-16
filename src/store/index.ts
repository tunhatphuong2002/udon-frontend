// https://zustand.docs.pmnd.rs/guides/slices-pattern
// The reason I'm using the slice pattern is because it's a good way to manage state in a large project
// Whenever you want to access the state, you can use the get() to access anything from boundedStore to the child slice

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { createCounterSlice } from '@/store/slices/counter.slice';
import { createUserSlice } from '@/store/slices/user.slice';
import { RootState } from '@/store/types';

// create bound store with all slices
export const useBoundStore = create<RootState>()(
  subscribeWithSelector(
    devtools((...args) => ({
      ...createCounterSlice(...args),
      ...createUserSlice(...args),
      // Add more slices as needed
    }))
  )
);
