import Ionicons from '@expo/vector-icons/Ionicons';
import { Formik } from 'formik';
import { useContext, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { ErrorMessage, Field } from '../components/Formik';
import { Button, CustomAlert } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import global from '../styles/global';
import theme from '../styles/theme';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Parola trebuie să conțină cel puțin o literă mare, o literă mică, un număr și un caracter special'
    )
    .required('Parola este obligatorie'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Parolele nu coincid')
    .required('Confirmarea parolei este obligatorie'),
});

export default function ResetPasswordScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const inputRefs = {
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const showAlert = (title, message, confirmText, onConfirm) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
    });
    setAlertVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      // Logică pentru resetarea parolei
      await auth.authenticate(); // Autentifică utilizatorul după resetare
      navigation.navigate('Home'); // Redirecționează la ecranul principal sau la ecranul de autentificare
    } catch (error) {
      showAlert('Eroare', error.message, 'OK', () => setAlertVisible(false));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {(props) => (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && global.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.textPrimary}
            />
          </Pressable>
          <Text style={styles.title}>Resetare parolă</Text>
          <Text style={styles.description}>
            Introdu o nouă parolă pentru contul tău.
          </Text>
          <View>
            <Field
              blurOnSubmit={false}
              formikProps={props}
              label="Parolă"
              name="password"
              onSubmitEditing={() => inputRefs.confirmPassword.current.focus()}
              placeholder="Introdu parola"
              ref={inputRefs.password}
              secure
              returnKeyType="next"
            />
            <ErrorMessage name="password" />
          </View>
          <View>
            <Field
              formikProps={props}
              label="Confirmare parolă"
              name="confirmPassword"
              placeholder="Introdu parola din nou"
              ref={inputRefs.confirmPassword}
              secure
              returnKeyType="done"
            />
            <ErrorMessage name="confirmPassword" />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Resetare" onPress={props.handleSubmit} />
          </View>
          <CustomAlert visible={alertVisible} {...alertProps} />
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
  },
  contentContainer: {
    ...global.spacingSmall,
    padding: theme.spacing[4],
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing[2],
    padding: theme.spacing[2],
  },
  title: {
    ...theme.fontSize['2xl'],
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  description: {
    ...theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[4],
  },
  buttonContainer: {
    marginTop: theme.spacing[4],
  },
});
