import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { SignInScreen, SignUpScreen } from '../screens';
import { AuthContext } from '../store/AuthContext';

const Stack = createNativeStackNavigator();

export default function AuthenticationStack() {
  const auth = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: 'Autentificare',
          animationTypeForReplace: !auth.isSignedIn ? 'pop' : 'push',
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Înregistrare',
          animationTypeForReplace: !auth.isSignedIn ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );
}
