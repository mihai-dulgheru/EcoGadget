import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthContent } from '../components/Auth';
import { LoadingOverlay } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import { signUp } from '../utils/Auth';

function SignUpScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const auth = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await signUp(email, password);
      await auth.authenticate(token);
    } catch (error) {
      Alert.alert('Authentication failed', error.message);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return (
    <AuthContent onAuthenticate={(credentials) => signupHandler(credentials)} />
  );
}

export default SignUpScreen;
