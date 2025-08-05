import { use, createContext, type PropsWithChildren, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext<any>({});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<boolean>(false);
  return (
    <AuthContext value={{
      token,
      setAuthToken: () => {
        console.log('setting tokens!')
      },
      getAuthToken: async () => {
        const token = await SecureStore.getItemAsync("loginToken")
        // get tmdb token to verify if self-token is valid.
        axios.get("")
        if (token) {
          setToken(true)
        } else {
          setToken(false)
        }
      },
      logout: () => {
      },
    }}>
      {children}
    </AuthContext>
  );
}
