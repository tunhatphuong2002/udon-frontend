import { CounterSlice } from '@/store/types/counter.type';
import { UserSlice } from '@/store/types/user.type';

export interface RootState extends CounterSlice, UserSlice {}
