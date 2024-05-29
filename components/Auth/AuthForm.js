import { Formik } from 'formik';
import { useRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import theme from '../../styles/theme';
import { Debug, ErrorMessage, Field } from '../Formik';
import { Button } from '../UI';

const validationSchema = Yup.object().shape({
  lastName: Yup.string().when('isSigningIn', {
    is: false,
    then: (schema) => schema.required('Numele este obligatoriu'),
    otherwise: (schema) => schema.notRequired(),
  }),
  firstName: Yup.string().when('isSigningIn', {
    is: false,
    then: (schema) => schema.required('Prenumele este obligatoriu'),
    otherwise: (schema) => schema.notRequired(),
  }),
  email: Yup.string()
    .email('Adresa de email nu este validă')
    .required('Adresa de email este obligatorie'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Telefonul trebuie să conțină doar cifre')
    .min(10, 'Telefonul trebuie să aibă cel puțin 10 cifre')
    .when('isSigningIn', {
      is: false,
      then: (schema) => schema.required('Telefonul este obligatoriu'),
      otherwise: (schema) => schema.notRequired(),
    }),
  password: Yup.string()
    .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Parola trebuie să conțină cel puțin o literă mare, o literă mică, un număr și un caracter special'
    )
    .required('Parola este obligatorie'),
});

export default function AuthForm({ debug = false, isSigningIn, onSubmit }) {
  const inputRefs = {
    lastName: useRef(null),
    firstName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    password: useRef(null),
  };

  const initialValues = {
    isSigningIn,
    lastName: 'Dulgheru',
    firstName: 'Mihai-Nicolae',
    email: 'dulgherumihai19@stud.ase.ro',
    phone: '0757949057',
    password: 'Password123!',
  };

  const handleFormSubmit = async (values) => {
    try {
      onSubmit(values);
    } catch (error) {
      Alert.alert(
        'Eroare',
        error.message || 'A apărut o eroare la trimiterea formularului'
      );
      console.error('Submission error', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {(props) => (
        <View style={styles.container}>
          {!isSigningIn && (
            <>
              <View>
                <Field
                  blurOnSubmit={false}
                  formikProps={props}
                  label="Nume"
                  name="lastName"
                  onSubmitEditing={() => inputRefs.firstName.current.focus()}
                  placeholder="Nume"
                  ref={inputRefs.lastName}
                  returnKeyType="next"
                />
                <ErrorMessage name="lastName" />
              </View>
              <View>
                <Field
                  blurOnSubmit={false}
                  formikProps={props}
                  label="Prenume"
                  name="firstName"
                  onSubmitEditing={() => inputRefs.email.current.focus()}
                  placeholder="Prenume"
                  ref={inputRefs.firstName}
                  returnKeyType="next"
                />
                <ErrorMessage name="firstName" />
              </View>
            </>
          )}
          <View>
            <Field
              blurOnSubmit={false}
              formikProps={props}
              keyboardType="email-address"
              label="Adresă email"
              name="email"
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
            />
            <ErrorMessage name="email" />
          </View>
          {!isSigningIn && (
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                keyboardType="phone-pad"
                label="Telefon"
                name="phone"
                onSubmitEditing={() => inputRefs.password.current.focus()}
                placeholder="Telefon"
                ref={inputRefs.phone}
                returnKeyType="next"
              />
              <ErrorMessage name="phone" />
            </View>
          )}
          <View>
            <Field
              formikProps={props}
              label="Parolă"
              name="password"
              placeholder="Parolă"
              ref={inputRefs.password}
              secure
            />
            <ErrorMessage name="password" />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={isSigningIn ? 'Autentificare' : 'Înregistrare'}
              onPress={props.handleSubmit}
            />
          </View>
          <Debug debug={debug} formikProps={props} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing['2'],
  },
  buttonContainer: {
    marginTop: theme.spacing['4'],
  },
});
