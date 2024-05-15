import { useNavigation } from '@react-navigation/native';
import { isEmpty, pick, some } from 'lodash';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';
import { FlatButton } from '../UI';
import AuthForm from './AuthForm';

function AuthView({ authType = 'signIn', onAuthenticate }) {
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    lastName: false,
    firstName: false,
    email: false,
    phone: false,
    password: false,
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
    const { lastName, firstName, email, phone, password } = credentials;

    const validationResults = {
      lastName: lastName.length === 0,
      firstName: firstName.length === 0,
      email: !email.includes('@'),
      phone: phone.length === 0,
      password: password.length <= 6,
    };

    if (isSigningIn) {
      const filteredFields = pick(validationResults, ['email', 'password']);
      return some(pick(validationResults, ['email', 'password']), Boolean)
        ? filteredFields
        : {};
    }
    return some(validationResults, Boolean) ? validationResults : {};
  }

  function submitHandler(credentials) {
    const invalidCredentials = validateCredentials(credentials);
    if (!isEmpty(invalidCredentials)) {
      Alert.alert('Date invalide', 'Verificați datele introduse.');
      setCredentialsInvalid(invalidCredentials);
      return;
    }
    onAuthenticate(credentials);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <AuthForm
        credentialsInvalid={credentialsInvalid}
        isSigningIn={isSigningIn}
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
