import { StateCreator } from 'zustand';
import { UserSlice, UserState, User } from '@/store/types/user.type';
import { OmitProperties } from '@/utils/type-factory';

type SetState = (fn: (state: UserSlice) => UserSlice) => void;

const createActions = (set: SetState) => ({
  login: async (email: string, password: string) => {
    set((state: UserSlice) => ({
      userState: {
        ...state.userState,
        isLoading: true,
        error: null,
      },
    }));

    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Fake successful login
      if (email === 'user@example.com' && password === 'password') {
        set((state: UserSlice) => ({
          userState: {
            ...state.userState,
            user: {
              id: '1',
              name: 'John Doe',
              email: 'user@example.com',
              avatar: 'https://i.pravatar.cc/150?u=user@example.com',
            },
            isAuthenticated: true,
            isLoading: false,
          },
        }));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set((state: UserSlice) => ({
        userState: {
          ...state.userState,
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        },
      }));
    }
  },

  logout: () =>
    set((state: UserSlice) => ({
      userState: {
        ...state.userState,
        user: null,
        isAuthenticated: false,
        error: null,
      },
    })),

  updateProfile: async (userData: Partial<User>) => {
    set((state: UserSlice) => ({
      userState: {
        ...state.userState,
        isLoading: true,
        error: null,
      },
    }));

    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      set((state: UserSlice) => ({
        userState: {
          ...state.userState,
          user: state.userState.user ? { ...state.userState.user, ...userData } : null,
          isLoading: false,
        },
      }));
    } catch (error) {
      set((state: UserSlice) => ({
        userState: {
          ...state.userState,
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        },
      }));
    }
  },
});

type ActionKeys = 'login' | 'logout' | 'updateProfile';
const initialState: OmitProperties<UserState, ActionKeys> = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const createUserSlice: StateCreator<UserSlice> = set => {
  const actions = createActions(set);

  return {
    userState: {
      ...initialState,
      ...actions,
    },
  };
};
