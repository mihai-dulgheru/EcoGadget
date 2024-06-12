import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppState } from './hooks/useAppState';
import { useOnlineManager } from './hooks/useOnlineManager';
import { RoleBasedNavigation } from './navigation';
import AuthContextProvider, { AuthContext } from './store/AuthContext';
import AsyncStorage from './utils/AsyncStorage';

SplashScreen.preventAutoHideAsync();

function Root() {
  const [appIsReady, setAppIsReady] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    async function prepare() {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          await auth.authenticate(user);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <RoleBasedNavigation />
    </View>
  );
}

function onAppStateChange(status) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function App() {
  useAppState(onAppStateChange);
  useOnlineManager();
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
