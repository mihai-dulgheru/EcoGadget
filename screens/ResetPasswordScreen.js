import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useCallback, useContext, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import { Button, CustomAlert, Loading } from '../components/UI';
import AccountService from '../services/AccountService';
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

const showAlert = (
  setAlertProps,
  setAlertVisible,
  title,
  message,
  confirmText,
  onConfirm
) => {
  setAlertProps({
    title,
    message,
    confirmText,
    onConfirm,
  });
  setAlertVisible(true);
};

const handleMutationError = (setAlertProps, setAlertVisible, error) => {
  showAlert(
    setAlertProps,
    setAlertVisible,
    'Eroare',
    error.message || 'A apărut o eroare',
    'OK',
    () => {
      setAlertVisible(false);
    }
  );
};

export default function ResetPasswordScreen({ navigation, route }) {
  const auth = useContext(AuthContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const inputRefs = {
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const initialValues = {
    ...route.params,
    password: '',
    confirmPassword: '',
  };

  const mutation = useMutation({
    mutationFn: async (values) => AccountService.resetPassword(values),
    onSuccess: (data) => auth.authenticate(data),
    onError: (error) =>
      handleMutationError(setAlertProps, setAlertVisible, error),
  });

  const handleFormSubmit = useCallback(
    async (values) => mutation.mutateAsync(values),
    [auth, mutation]
  );

  if (mutation.isPending) {
    return <Loading />;
  }

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
          <Debug formikProps={props} />
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
