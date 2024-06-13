import { useContext, useState } from 'react';
import { AuthView } from '../components/Auth';
import { CustomAlert, LoadingOverlay } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import { signUp } from '../utils/Auth';

export default function SignUpScreen() {
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

  async function handleSignUp(credentials) {
    setIsAuthenticating(true);
    try {
      const user = await signUp(credentials);
      await auth.authenticate(user);
    } catch (error) {
      showAlert('Înregistrare eșuată', error.message, 'OK', () =>
        setAlertVisible(false)
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creare cont în curs..." />;
  }

  return (
    <>
      <AuthView
        authType="signUp"
        onAuthenticate={(credentials) => handleSignUp(credentials)}
      />
      <CustomAlert visible={alertVisible} {...alertProps} />
    </>
  );
}
