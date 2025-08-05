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
  const { token, getAuthToken } = useSession();
  useEffect(() => {
    (async () => { getAuthToken() })();
  },)

  return (
    <Stack>
      <Stack.Protected guard={token}>
        <Stack.Screen name="temp" />
      </Stack.Protected>

      <Stack.Protected guard={!token}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  )
}
