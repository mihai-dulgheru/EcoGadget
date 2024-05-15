import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';
import { Button, Input } from '../UI';

function AuthForm({ credentialsInvalid, isLogin, onSubmit }) {
  const [user, setUser] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const inputRefs = {
    email: useRef(null),
    confirmEmail: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  function handleChange(fieldName, value) {
    setUser((prevState) => ({ ...prevState, [fieldName]: value }));
  }

  function handleFormSubmit() {
    onSubmit(user);
  }

  return (
    <View style={styles.container}>
      <View>
        <Input
          blurOnSubmit={false}
          isInvalid={credentialsInvalid.email}
          keyboardType="email-address"
          label="Adresă email"
          onChangeText={(value) => handleChange('email', value)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputRefs.confirmEmail.current.focus();
            } else {
              inputRefs.password.current.focus();
            }
          }}
          placeholder="Adresă email"
          ref={inputRefs.email}
          returnKeyType="next"
          value={user.email}
        />
        {!isLogin && (
          <Input
            blurOnSubmit={false}
            isInvalid={credentialsInvalid.confirmEmail}
            keyboardType="email-address"
            label="Confirmă email"
            onChangeText={(value) => {
              handleChange('confirmEmail', value);
            }}
            onSubmitEditing={() => inputRefs.password.current.focus()}
            placeholder="Confirmă email"
            ref={inputRefs.confirmEmail}
            returnKeyType="next"
            value={user.confirmEmail}
          />
        )}
        <Input
          blurOnSubmit={!!isLogin}
          isInvalid={credentialsInvalid.password}
          label="Parolă"
          onChangeText={(value) => handleChange('password', value)}
          onSubmitEditing={() => {
            if (!isLogin) {
              inputRefs.confirmPassword.current.focus();
            } else {
              handleFormSubmit();
            }
          }}
          placeholder="Parolă"
          ref={inputRefs.password}
          returnKeyType={isLogin ? 'done' : 'next'}
          secure
          value={user.password}
        />
        {!isLogin && (
          <Input
            isInvalid={credentialsInvalid.confirmPassword}
            label="Confirmă parola"
            onChangeText={(value) => {
              handleChange('confirmPassword', value);
            }}
            onSubmitEditing={() => handleFormSubmit()}
            placeholder="Confirmă parola"
            ref={inputRefs.confirmPassword}
            returnKeyType="done"
            secure
            value={user.confirmPassword}
          />
        )}
        <View style={styles.buttonContainer}>
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
  container: {
    gap: theme.spacing['4'],
  },
  buttonContainer: {
    marginTop: theme.spacing['4'],
  },
});
