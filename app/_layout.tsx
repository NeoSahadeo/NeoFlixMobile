import '../global.css'

import { Stack } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';

import { SessionProvider } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Root() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  )
}

function RootNavigator() {
  const { apiKey, getAuthToken } = useSession();
  useEffect(() => {
    (async () => { getAuthToken() })();
  }, [])

  return (
    <Stack>
      <Stack.Protected guard={apiKey}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="viewer" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found.tsx" options={{ headerShown: false }} />

      <Stack.Protected guard={!apiKey}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  )
}
