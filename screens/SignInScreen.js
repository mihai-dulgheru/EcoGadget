import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthView } from '../components/Auth';
import { LoadingOverlay } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import { signInWithPassword } from '../utils/Auth';

export default function SignInScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const auth = useContext(AuthContext);

  async function handleSignIn(credentials) {
    setIsAuthenticating(true);
    try {
      const token = await signInWithPassword(credentials);
      await auth.authenticate(token);
    } catch (error) {
      Alert.alert('Autentificare eșuată!', error.message);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Autentificare în curs..." />;
  }

  return (
    <AuthView
      authType="signIn"
      onAuthenticate={(credentials) => handleSignIn(credentials)}
    />
  );
}
