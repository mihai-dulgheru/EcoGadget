import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';
import { FlatButton } from '../UI';
import AuthForm from './AuthForm';

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('SignUp');
    } else {
      navigation.replace('SignIn');
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    confirmEmail = confirmEmail.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert('Date invalide', 'Verificați datele introduse.');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <AuthForm
        credentialsInvalid={credentialsInvalid}
        isLogin={isLogin}
        onSubmit={(credentials) => submitHandler(credentials)}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={() => switchAuthModeHandler()}>
          {isLogin ? 'Creează un cont nou' : 'Autentifică-te'}
        </FlatButton>
      </View>
    </ScrollView>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    elevation: 2,
    marginHorizontal: theme.spacing['8'],
    marginTop: theme.spacing['16'],
    padding: theme.spacing['4'],
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: theme.spacing['2'],
  },
});
