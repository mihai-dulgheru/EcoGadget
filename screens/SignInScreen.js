import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthContent } from '../components/Auth';
import { LoadingOverlay } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import { signInWithPassword } from '../utils/Auth';

function SignInScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authContext = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await signInWithPassword(email, password);
      await authContext.authenticate(token);
    } catch (error) {
      Alert.alert('Authentication failed!', error.message);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return (
    <AuthContent
      isLogin
      onAuthenticate={(credentials) => loginHandler(credentials)}
    />
  );
}

export default SignInScreen;
