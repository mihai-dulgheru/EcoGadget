import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import theme from '../../styles/theme';
import { FlatButton } from '../UI';
import AuthForm from './AuthForm';

function AuthView({ authType = 'signIn', onAuthenticate }) {
  const isSigningIn = useMemo(() => authType === 'signIn', [authType]);
  const navigation = useNavigation();

  function switchAuthModeHandler() {
    if (isSigningIn) {
      navigation.replace('SignUp');
    } else {
      navigation.replace('SignIn');
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <AuthForm
        isSigningIn={isSigningIn}
        onSubmit={(credentials) => onAuthenticate(credentials)}
      />
      <FlatButton
        extraStyles={{ buttonText: styles.buttonText }}
        onPress={() => switchAuthModeHandler()}
      >
        {isSigningIn ? 'Creează un cont nou' : 'Autentifică-te'}
      </FlatButton>
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
    gap: theme.spacing['2'],
    justifyContent: 'center',
    padding: theme.spacing['8'],
  },
  buttonText: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
