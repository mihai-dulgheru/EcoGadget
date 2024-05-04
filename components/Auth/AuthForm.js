import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';
import { Button, Input } from '../UI';

function AuthForm({ credentialsInvalid, isLogin, onSubmit }) {
  const inputEmailRef = useRef(null);
  const inputConfirmEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputConfirmPasswordRef = useRef(null);

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

  function handleInputValueUpdate(inputField, updatedValue) {
    switch (inputField) {
      case 'email':
        setEnteredEmail(updatedValue);
        break;
      case 'confirmEmail':
        setEnteredConfirmEmail(updatedValue);
        break;
      case 'password':
        setEnteredPassword(updatedValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(updatedValue);
        break;
      default:
        break;
    }
  }

  function handleFormSubmit() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <View style={styles.form}>
      <View>
        <Input
          blurOnSubmit={false}
          isInvalid={credentialsInvalid.email}
          keyboardType="email-address"
          label="Adresă Email"
          onChangeText={(value) => handleInputValueUpdate('email', value)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputConfirmEmailRef.current.focus();
            } else {
              inputPasswordRef.current.focus();
            }
          }}
          placeholder="Adresă Email"
          ref={inputEmailRef}
          returnKeyType="next"
          value={enteredEmail}
        />
        {!isLogin && (
          <Input
            blurOnSubmit={false}
            isInvalid={credentialsInvalid.confirmEmail}
            keyboardType="email-address"
            label="Confirmă Email"
            onChangeText={(value) => {
              handleInputValueUpdate('confirmEmail', value);
            }}
            onSubmitEditing={() => inputPasswordRef.current.focus()}
            placeholder="Confirmă Email"
            ref={inputConfirmEmailRef}
            returnKeyType="next"
            value={enteredConfirmEmail}
          />
        )}
        <Input
          blurOnSubmit={!!isLogin}
          isInvalid={credentialsInvalid.password}
          label="Parolă"
          onChangeText={(value) => handleInputValueUpdate('password', value)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputConfirmPasswordRef.current.focus();
            } else {
              handleFormSubmit();
            }
          }}
          placeholder="Parolă"
          ref={inputPasswordRef}
          returnKeyType={isLogin ? 'done' : 'next'}
          secure
          value={enteredPassword}
        />
        {!isLogin && (
          <Input
            isInvalid={credentialsInvalid.confirmPassword}
            label="Confirmă Parola"
            onChangeText={(value) => {
              handleInputValueUpdate('confirmPassword', value);
            }}
            onSubmitEditing={() => handleFormSubmit()}
            placeholder="Confirmă Parola"
            ref={inputConfirmPasswordRef}
            returnKeyType="done"
            secure
            value={enteredConfirmPassword}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={() => handleFormSubmit()}>
            {isLogin ? 'Autentificare' : 'Înregistrare'}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  form: {
    padding: theme.spacing['6'],
  },
  buttons: {
    marginTop: theme.spacing['4'],
  },
});
