import { use, createContext, type PropsWithChildren, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const AuthContext = createContext<any>({});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

async function setAuthToken(value: string) {
  await SecureStore.setItemAsync("tmdbApiKey", value)
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  return (
    <AuthContext value={{
      apiKey,
      setAuthToken: setAuthToken,
      getAuthToken: async () => {
        const token = await SecureStore.getItemAsync("loginToken")
        const serverAddress = await AsyncStorage.getItem("backendAddress")
        // get tmdb token to verify if self-token is valid.
        const response = await axios.get(serverAddress + "/tmdb_apikey", {
          headers: {
            "Authorization": "Bearer " + token,
          }
        })
        if (response.status != 200) return

        const tmdbApikey = response.data["access_token"]
        if (!tmdbApikey) {
          setApiKey(null)
          await SecureStore.deleteItemAsync("tmdbApiKey")
          return
        };

        setAuthToken(tmdbApikey)
        setApiKey(tmdbApikey)
      },
      logout: async () => {
        const token = await SecureStore.getItemAsync("loginToken")
        const backendAddress = await AsyncStorage.getItem("backendAddress")
        await axios.get(backendAddress + "/logout", {
          headers: {
            "Authorization": "Bearer " + token
          }
        })
        await SecureStore.deleteItemAsync("loginToken")
        await SecureStore.deleteItemAsync("tmdbApiKey")
        setApiKey(null)
      },
      logoutall: async () => {
        const token = await SecureStore.getItemAsync("loginToken")
        const backendAddress = await AsyncStorage.getItem("backendAddress")
        await axios.get(backendAddress + "/logoutall", {
          headers: {
            "Authorization": "Bearer " + token
          }
        })
        await SecureStore.deleteItemAsync("loginToken")
        await SecureStore.deleteItemAsync("tmdbApiKey")
        setApiKey(null)
      }
    }}>
      {children}
    </AuthContext>
  );
}
