import { StateCreator } from 'zustand';
import { RootState } from '@/store/types';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface UserSlice {
  userState: UserState;
}

export type UserSliceCreator = StateCreator<RootState, [], [], UserSlice>;
