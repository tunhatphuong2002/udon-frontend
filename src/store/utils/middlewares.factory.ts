import { devtools, persist } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * @description persist middleware for zustand
 * @param f - State creator function to initialize store
 * @param name - Name of the store
 * @ref https://zustand.docs.pmnd.rs/guides/typescript#using-middlewares
 * @example
 * const useStore = create<State>(
 *   middlewarePersist((set) => ({
 *     count: 0,
 *     increment: () => set((state) => { state.count++ })
 *   }),
 *   'store-name'
 * ))
 */
const middlewarePersist = <T>(
  f: StateCreator<T, [['zustand/devtools', never]], []>,
  name: string
) => devtools(persist(f, { name }));

/**
 * @description Middleware using Immer for Zustand to manage state easier
 * @param f - State creator function to initialize store
 * @ref https://zustand.docs.pmnd.rs/guides/typescript#using-middlewares
 * @example
 * const useStore = create<State>(middlewareImmer((set) => ({
 *   count: 0,
 *   increment: () => set((state) => { state.count++ })
 * })))
 */
const middlewareImmer = <T>(f: StateCreator<T, [['zustand/immer', never]], []>) =>
  devtools(immer(f));

export { middlewarePersist, middlewareImmer };
