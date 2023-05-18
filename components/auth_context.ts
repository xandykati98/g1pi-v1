import { User } from '@supabase/auth-helpers-nextjs';
import { createContext } from 'react';

const AuthContext = createContext<User | any>({});

export default AuthContext