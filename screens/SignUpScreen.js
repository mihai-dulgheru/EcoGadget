import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthView } from '../components/Auth';
import { LoadingOverlay } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import { signUp } from '../utils/Auth';

export default function SignUpScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const auth = useContext(AuthContext);

  async function handleSignUp(credentials) {
    setIsAuthenticating(true);
    try {
      const user = await signUp(credentials);
      await auth.authenticate(user);
    } catch (error) {
      Alert.alert('Înregistrare eșuată', error.message);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creare cont în curs..." />;
  }

  return (
    <AuthView
      authType="signUp"
      onAuthenticate={(credentials) => handleSignUp(credentials)}
    />
  );
}
