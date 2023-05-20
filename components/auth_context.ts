
import type { User } from '@prisma/client';
import { createContext } from 'react';


const AuthContext = createContext<User>({} as User);

export default AuthContext