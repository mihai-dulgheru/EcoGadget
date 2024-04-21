import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from '../UI';

function AuthForm({ credentialsInvalid, isLogin, onSubmit, scrollViewRef }) {
  const scrollToInput = (ref) => {
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

  const {
    email: isEmailInvalid,
    confirmEmail: isConfirmEmailInvalid,
    password: isPasswordInvalid,
    confirmPassword: isConfirmPasswordInvalid,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'confirmEmail':
        setEnteredConfirmEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
      default:
        break;
    }
  }

  function submitHandler() {
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
          isInvalid={isEmailInvalid}
          keyboardType="email-address"
          label="Email Address"
          onFocus={() => scrollToInput(inputEmailRef)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputConfirmEmailRef.current.focus();
            } else {
              inputPasswordRef.current.focus();
            }
          }}
          onUpdateValue={(value) => updateInputValueHandler('email', value)}
          placeholder="Email Address"
          ref={inputEmailRef}
          returnKeyType="next"
          value={enteredEmail}
        />
        {!isLogin && (
          <Input
            blurOnSubmit={false}
            isInvalid={isConfirmEmailInvalid}
            keyboardType="email-address"
            label="Confirm Email Address"
            onFocus={() => scrollToInput(inputConfirmEmailRef)}
            onSubmitEditing={() => inputPasswordRef.current.focus()}
            onUpdateValue={(value) => {
              updateInputValueHandler('confirmEmail', value);
            }}
            placeholder="Confirm Email Address"
            ref={inputConfirmEmailRef}
            returnKeyType="next"
            value={enteredConfirmEmail}
          />
        )}
        <Input
          blurOnSubmit={!!isLogin}
          isInvalid={isPasswordInvalid}
          label="Password"
          onFocus={() => scrollToInput(inputPasswordRef)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputConfirmPasswordRef.current.focus();
            } else {
              submitHandler();
            }
          }}
          onUpdateValue={(value) => updateInputValueHandler('password', value)}
          placeholder="Password"
          ref={inputPasswordRef}
          returnKeyType={isLogin ? 'done' : 'next'}
          secure
          value={enteredPassword}
        />
        {!isLogin && (
          <Input
            isInvalid={isConfirmPasswordInvalid}
            label="Confirm Password"
            onFocus={() => scrollToInput(inputConfirmPasswordRef)}
            onSubmitEditing={() => submitHandler()}
            onUpdateValue={(value) => {
              updateInputValueHandler('confirmPassword', value);
            }}
            placeholder="Confirm Password"
            ref={inputConfirmPasswordRef}
            returnKeyType="done"
            secure
            value={enteredConfirmPassword}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={() => submitHandler()}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
