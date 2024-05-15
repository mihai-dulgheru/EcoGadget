import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';
import { FlatButton } from '../UI';
import AuthForm from './AuthForm';

function AuthView({ authType = 'signIn', onAuthenticate }) {
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });
  const isSigningIn = useMemo(() => authType === 'signIn', [authType]);
  const navigation = useNavigation();

  function switchAuthModeHandler() {
    if (isSigningIn) {
      navigation.replace('SignUp');
    } else {
      navigation.replace('SignIn');
    }
  }

  function validateCredentials(credentials) {
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
      (!isSigningIn && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      return {
        email: !emailIsValid,
        password: !passwordIsValid,
        confirmEmail: !emailsAreEqual,
        confirmPassword: !passwordsAreEqual,
      };
    }

    return {};
  }

  function submitHandler(credentials) {
    const invalidCredentials = validateCredentials(credentials);
    if (!isEmpty(invalidCredentials)) {
      Alert.alert('Date invalide', 'Verificați datele introduse.');
      setCredentialsInvalid(invalidCredentials);
      return;
    }
    const { email, password } = credentials;
    onAuthenticate({ email, password });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <AuthForm
        credentialsInvalid={credentialsInvalid}
        isLogin={isSigningIn}
        onSubmit={(credentials) => submitHandler(credentials)}
      />
      <View style={styles.buttonContainer}>
        <FlatButton
          extraStyles={{ buttonText: styles.buttonText }}
          onPress={() => switchAuthModeHandler()}
        >
          {isSigningIn ? 'Creează un cont nou' : 'Autentifică-te'}
        </FlatButton>
      </View>
    </ScrollView>
  );
}

export default AuthView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing['8'],
  },
  buttonContainer: {
    marginTop: theme.spacing['4'],
  },
  buttonText: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
