import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import { Button, CustomAlert, LoadingOverlay } from '../components/UI';
import AdminService from '../services/AdminService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  lastName: Yup.string().required('Numele este obligatoriu'),
  firstName: Yup.string().required('Prenumele este obligatoriu'),
  email: Yup.string()
    .email('Email invalid')
    .required('Emailul este obligatoriu'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Telefonul trebuie să conțină doar cifre')
    .min(10, 'Telefonul trebuie să aibă cel puțin 10 cifre')
    .required('Telefonul este obligatoriu'),
});

export default function EditUserAdminScreen({ navigation, route }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const inputRefs = {
    lastName: useRef(null),
    firstName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
  };

  const initialValues = useMemo(() => {
    if (route.params && route.params.user) {
      return route.params.user;
    }
    return {
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
    };
  }, [route.params]);

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
    mutationFn: async (values) =>
      AdminService.updateUser(AxiosAuth, values._id, values),
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
    return (
      <LoadingOverlay
        message={
          initialValues?.role === 'recycling_manager'
            ? 'Salvare manager...'
            : 'Salvare utilizator...'
        }
      />
    );
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
                formikProps={props}
                keyboardType="phone-pad"
                label="Telefon"
                name="phone"
                placeholder="Introduceți telefonul"
                ref={inputRefs.phone}
              />
              <ErrorMessage name="phone" />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={
                props.values.role === 'recycling_manager'
                  ? 'Salvează manager'
                  : 'Salvează utilizator'
              }
              onPress={props.handleSubmit}
            />
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
