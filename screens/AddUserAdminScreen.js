import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { RoleSelector } from '../components/AddUserAdmin';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import { Button, CustomAlert, LoadingOverlay } from '../components/UI';
import AdminService from '../services/AdminService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  role: Yup.string()
    .oneOf(['user', 'recycling_manager'])
    .required('Rolul este obligatoriu'),
  lastName: Yup.string().required('Numele este obligatoriu'),
  firstName: Yup.string().required('Prenumele este obligatoriu'),
  email: Yup.string()
    .email('Email invalid')
    .required('Emailul este obligatoriu'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Telefonul trebuie să conțină doar cifre')
    .min(10, 'Telefonul trebuie să aibă cel puțin 10 cifre')
    .required('Telefonul este obligatoriu'),
  password: Yup.string()
    .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Parola trebuie să conțină cel puțin o literă mare, o literă mică, un număr și un caracter special'
    )
    .required('Parola este obligatorie'),
});

// TODO: Add default values for the form
const initialValues = {
  role: 'user',
  lastName: '',
  firstName: '',
  email: '',
  phone: '',
  password: '',
};

export default function AddUserAdminScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const inputRefs = {
    lastName: useRef(null),
    firstName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    password: useRef(null),
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

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (values.role === 'user') {
        await AdminService.addUser(AxiosAuth, values);
      } else {
        await AdminService.addRecyclingManager(AxiosAuth, values);
      }
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(['users']);
      await queryClient.invalidateQueries(['recyclingManagers']);
      if (variables.role === 'user') {
        navigation.navigate('UsersAdmin');
      } else {
        navigation.navigate('RecyclingManagersAdmin');
      }
    },
    onError: (error) => {
      showAlert('Eroare', error.message || 'A apărut o eroare', 'OK', () =>
        setAlertVisible(false)
      );
    },
  });

  const handleSave = useCallback(
    async (values) => mutation.mutateAsync(values),
    [mutation]
  );

  if (mutation.isPending) {
    return <LoadingOverlay message="Salvare în curs..." />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSave}
    >
      {(props) => (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <RoleSelector />
          <View style={global.spacingMedium}>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                label="Nume"
                name="lastName"
                onSubmitEditing={() => inputRefs.firstName.current.focus()}
                placeholder="Introduceți numele"
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
                placeholder="Introduceți prenumele"
                ref={inputRefs.firstName}
                returnKeyType="next"
              />
              <ErrorMessage name="firstName" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                keyboardType="email-address"
                label="Email"
                name="email"
                onSubmitEditing={() => inputRefs.phone.current.focus()}
                placeholder="Introduceți emailul"
                ref={inputRefs.email}
                returnKeyType="next"
              />
              <ErrorMessage name="email" />
            </View>
            <View>
              <Field
                blurOnSubmit={false}
                formikProps={props}
                keyboardType="phone-pad"
                label="Telefon"
                name="phone"
                onSubmitEditing={() => inputRefs.password.current.focus()}
                placeholder="Introduceți telefonul"
                ref={inputRefs.phone}
                returnKeyType="next"
              />
              <ErrorMessage name="phone" />
            </View>
            <View>
              <Field
                autoComplete="new-password"
                autoCorrect={false}
                formikProps={props}
                label="Parolă"
                name="password"
                placeholder="Parolă"
                ref={inputRefs.password}
                secure
                textContentType="newPassword"
              />
              <ErrorMessage name="password" />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Salvează" onPress={props.handleSubmit} />
          </View>
          <CustomAlert visible={alertVisible} {...alertProps} />
          <Debug formikProps={props} />
        </ScrollView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  contentContainer: {
    ...global.spacingMedium,
    padding: theme.spacing[4],
  },
  buttonContainer: {
    marginTop: theme.spacing[4],
  },
});
