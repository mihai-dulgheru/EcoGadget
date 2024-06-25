import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import {
  ConfirmCodeScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  SignInScreen,
  SignUpScreen,
} from '../screens';
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
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmCode"
        component={ConfirmCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
