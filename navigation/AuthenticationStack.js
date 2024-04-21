import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { SignInScreen, SignUpScreen } from '../screens';
import { AuthContext } from '../store/AuthContext';

const Stack = createNativeStackNavigator();

export default function AuthenticationStack() {
  const auth = useContext(AuthContext);
  const animationTypeForReplace = !auth.isSignedIn ? 'pop' : 'push';

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: 'Sign in',
          animationTypeForReplace,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Sign up',
          animationTypeForReplace,
        }}
      />
    </Stack.Navigator>
  );
}
