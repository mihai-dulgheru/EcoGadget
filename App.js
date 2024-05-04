import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthenticationStack, TabNavigator } from './navigation';
import AuthContextProvider, { AuthContext } from './store/AuthContext';
import AsyncStorage from './utils/AsyncStorage';

function Navigation() {
  const auth = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!auth.isSignedIn && <AuthenticationStack />}
      {/* {auth.isSignedIn && <NavigationStack />} */}
      {auth.isSignedIn && <TabNavigator />}
    </NavigationContainer>
  );
}

SplashScreen.preventAutoHideAsync();

function Root() {
  const [appIsReady, setAppIsReady] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    async function prepare() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await auth.authenticate(token);
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
      <Navigation />
    </View>
  );
}

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
