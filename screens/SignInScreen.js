import { useContext, useState } from 'react';
import { View } from 'react-native';
import { AuthView } from '../components/Auth';
import { CustomAlert, LoadingOverlay } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import global from '../styles/global';
import { signInWithPassword } from '../utils/Auth';

export default function SignInScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const auth = useContext(AuthContext);

  const showAlert = (title, message, confirmText, onConfirm) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
    });
    setAlertVisible(true);
  };

  async function handleSignIn(credentials) {
    setIsAuthenticating(true);
    try {
      const user = await signInWithPassword(credentials);
      await auth.authenticate(user);
    } catch (error) {
      showAlert('Autentificare eșuată', error.message, 'OK', () =>
        setAlertVisible(false)
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Autentificare în curs..." />;
  }

  return (
    <View style={global.flex1}>
      <AuthView
        authType="signIn"
        onAuthenticate={(credentials) => handleSignIn(credentials)}
      />
      <CustomAlert visible={alertVisible} {...alertProps} />
    </View>
  );
}
