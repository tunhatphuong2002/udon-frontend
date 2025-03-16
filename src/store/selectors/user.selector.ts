import { useBoundStore } from '@/store';
import { UserSlice } from '@/store/types/user.type';

export const useUserSelector = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, updateProfile } = useBoundStore(
    (state: UserSlice) => state.userState
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  };
};
