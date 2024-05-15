import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { SignInScreen, SignUpScreen } from '../screens';
import { AuthContext } from '../store/AuthContext';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  const auth = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          animationTypeForReplace: !auth.isSignedIn ? 'pop' : 'push',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          animationTypeForReplace: !auth.isSignedIn ? 'pop' : 'push',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
