import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';
import { Button, Input } from '../UI';

function AuthForm({ credentialsInvalid, isSigningIn, onSubmit }) {
  const [user, setUser] = useState({
    lastName: 'Dulgheru',
    firstName: 'Mihai-Nicolae',
    email: 'dulgherumihai19@stud.ase.ro',
    phone: '0757949057',
    password: 'Password123!',
  });
  const inputRefs = {
    lastName: useRef(null),
    firstName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    password: useRef(null),
  };

  function handleChange(fieldName, value) {
    setUser((prevState) => ({ ...prevState, [fieldName]: value }));
  }

  function handleFormSubmit() {
    onSubmit(user);
  }

  return (
    <View style={styles.container}>
      {!isSigningIn && (
        <>
          <Input
            blurOnSubmit={false}
            isInvalid={credentialsInvalid.lastName}
            label="Nume"
            onChangeText={(value) => handleChange('lastName', value)}
            onSubmitEditing={() => inputRefs.firstName.current.focus()}
            placeholder="Nume"
            ref={inputRefs.lastName}
            returnKeyType="next"
            value={user.lastName}
          />
          <Input
            blurOnSubmit={false}
            isInvalid={credentialsInvalid.firstName}
            label="Prenume"
            onChangeText={(value) => handleChange('firstName', value)}
            onSubmitEditing={() => inputRefs.email.current.focus()}
            placeholder="Prenume"
            ref={inputRefs.firstName}
            returnKeyType="next"
            value={user.firstName}
          />
        </>
      )}
      <Input
        blurOnSubmit={false}
        isInvalid={credentialsInvalid.email}
        keyboardType="email-address"
        label="Adresă email"
        onChangeText={(value) => handleChange('email', value)}
        onSubmitEditing={() => {
          if (!isSigningIn) {
            inputRefs.phone.current.focus();
          } else {
            inputRefs.password.current.focus();
          }
        }}
        placeholder="Adresă email"
        ref={inputRefs.email}
        returnKeyType="next"
        value={user.email}
      />
      {!isSigningIn && (
        <Input
          blurOnSubmit={false}
          isInvalid={credentialsInvalid.phone}
          keyboardType="phone-pad"
          label="Telefon"
          onChangeText={(value) => handleChange('phone', value)}
          onSubmitEditing={() => inputRefs.password.current.focus()}
          placeholder="Telefon"
          ref={inputRefs.phone}
          returnKeyType="next"
          value={user.phone}
        />
      )}
      <Input
        isInvalid={credentialsInvalid.password}
        label="Parolă"
        onChangeText={(value) => handleChange('password', value)}
        placeholder="Parolă"
        ref={inputRefs.password}
        secure
        value={user.password}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={() => handleFormSubmit()}>
          {isSigningIn ? 'Autentificare' : 'Înregistrare'}
        </Button>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing['2'],
  },
  buttonContainer: {
    marginTop: theme.spacing['4'],
  },
});
