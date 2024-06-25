import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import global from '../../styles/global';
import theme from '../../styles/theme';
import { Debug, ErrorMessage, Field } from '../Formik';
import { Button, CustomAlert } from '../UI';

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

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const initialValues = {
    isSigningIn,
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    password: '',
  };

  const showAlert = (
    title,
    message,
    confirmText,
    onConfirm,
    cancelText,
    onCancel
  ) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
      cancelText,
      onCancel,
    });
    setAlertVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      onSubmit(values);
    } catch (error) {
      showAlert(
        'Eroare',
        error.message || 'A apărut o eroare la trimiterea formularului',
        'OK',
        () => setAlertVisible(false)
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
              label="Adresă de email"
              name="email"
              onSubmitEditing={() => {
                if (!isSigningIn) {
                  inputRefs.phone.current.focus();
                } else {
                  inputRefs.password.current.focus();
                }
              }}
              placeholder="Adresă de email"
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
              autoComplete={isSigningIn ? 'current-password' : 'new-password'}
              autoCorrect={false}
              formikProps={props}
              label="Parolă"
              name="password"
              placeholder="Parolă"
              ref={inputRefs.password}
              secure
              textContentType={isSigningIn ? 'password' : 'newPassword'}
            />
            <ErrorMessage name="password" />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={isSigningIn ? 'Autentifică-te' : 'Înregistrează-te'}
              onPress={props.handleSubmit}
            />
          </View>
          <Debug debug={debug} formikProps={props} />
          <CustomAlert visible={alertVisible} {...alertProps} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingSmall,
  },
  buttonContainer: {
    marginTop: theme.spacing[6],
  },
});
