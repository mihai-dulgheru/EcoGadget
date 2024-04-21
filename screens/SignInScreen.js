import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthContent } from '../components/Auth';
import { LoadingOverlay } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import { signInWithPassword } from '../utils/Auth';

function SignInScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const auth = useContext(AuthContext);

  async function handleSignIn({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await signInWithPassword(email, password);
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
    <AuthContent
      isLogin
      onAuthenticate={(credentials) => handleSignIn(credentials)}
    />
  );
}

export default SignInScreen;
