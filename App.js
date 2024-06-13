import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from './hooks/useAppState';
import { useOnlineManager } from './hooks/useOnlineManager';
import { RoleBasedNavigation } from './navigation';
import AuthContextProvider, { AuthContext } from './store/AuthContext';
import AsyncStorage from './utils/AsyncStorage';

SplashScreen.preventAutoHideAsync();

function Root() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Bold': require('./assets/fonts/Outfit-Bold.ttf'),
    'ZillaSlab-Regular': require('./assets/fonts/ZillaSlab-Regular.ttf'),
  });
  const auth = useContext(AuthContext);

  useEffect(() => {
    const prepare = async () => {
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
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && (fontsLoaded || fontError)) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded, fontError]);

  if (!appIsReady || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <View style={styles.flexContainer} onLayout={onLayoutRootView}>
      <RoleBasedNavigation />
    </View>
  );
}

const onAppStateChange = (status) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function App() {
  useAppState(onAppStateChange);
  useOnlineManager();
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.flexContainer}>
        <SafeAreaView style={styles.flexContainer}>
          <StatusBar style="auto" />
          <AuthContextProvider>
            <Root />
          </AuthContextProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});
