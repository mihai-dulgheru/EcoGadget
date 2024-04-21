import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from '../UI';

function AuthForm({ credentialsInvalid, isLogin, onSubmit, scrollViewRef }) {
  const scrollToFocusedInput = (ref) => {
    ref.current.measure((_fx, _fy, _width, _height, _px, py) => {
      scrollViewRef.current.scrollTo({ x: 0, y: py, animated: true });
    });
  };

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
          onFocus={() => scrollToFocusedInput(inputEmailRef)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputConfirmEmailRef.current.focus();
            } else {
              inputPasswordRef.current.focus();
            }
          }}
          onUpdateValue={(value) => handleInputValueUpdate('email', value)}
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
            onFocus={() => scrollToFocusedInput(inputConfirmEmailRef)}
            onSubmitEditing={() => inputPasswordRef.current.focus()}
            onUpdateValue={(value) => {
              handleInputValueUpdate('confirmEmail', value);
            }}
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
          onFocus={() => scrollToFocusedInput(inputPasswordRef)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputConfirmPasswordRef.current.focus();
            } else {
              handleFormSubmit();
            }
          }}
          onUpdateValue={(value) => handleInputValueUpdate('password', value)}
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
            onFocus={() => scrollToFocusedInput(inputConfirmPasswordRef)}
            onSubmitEditing={() => handleFormSubmit()}
            onUpdateValue={(value) => {
              handleInputValueUpdate('confirmPassword', value);
            }}
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
    padding: 20,
  },
  buttons: {
    marginTop: 12,
  },
});
