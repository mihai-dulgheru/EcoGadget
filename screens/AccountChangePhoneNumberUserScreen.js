import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import { Button, CustomAlert, Loading } from '../components/UI';
import UserService from '../services/UserService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Telefonul trebuie să conțină doar cifre')
    .min(10, 'Telefonul trebuie să aibă cel puțin 10 cifre')
    .required('Telefonul este obligatoriu')
    .test(
      'is-different',
      'Numărul de telefon trebuie să fie diferit',
      function (value) {
        return value !== this.parent.initialPhone;
      }
    ),
});

const initialValues = (personalInfo) => ({
  initialPhone: personalInfo.phone,
  phone: personalInfo.phone,
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

const handleMutationSuccess = (
  queryClient,
  navigation,
  setAlertProps,
  setAlertVisible,
  variables,
  personalInfo
) => {
  navigation.setParams({
    personalInfo: { ...personalInfo, ...variables },
  });
  showAlert(
    setAlertProps,
    setAlertVisible,
    'Succes',
    'Numărul de telefon a fost actualizat cu succes',
    'OK',
    async () => {
      setAlertVisible(false);
      navigation.goBack();
      await queryClient.invalidateQueries(['accountInfo', 'personalInfo']);
    }
  );
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

export default function AccountChangePhoneNumberUserScreen({
  navigation,
  route,
}) {
  const { personalInfo } = route.params;
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const mutation = useMutation({
    mutationFn: async ({ phone }) =>
      UserService.updatePhoneNumber(AxiosAuth, { phone }),
    onSuccess: (_, variables) =>
      handleMutationSuccess(
        queryClient,
        navigation,
        setAlertProps,
        setAlertVisible,
        variables,
        personalInfo
      ),
    onError: (error) =>
      handleMutationError(setAlertProps, setAlertVisible, error),
  });

  const handleSubmit = useCallback(
    async (values) => mutation.mutateAsync(values),
    [mutation]
  );

  if (mutation.isPending) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Actualizare număr de telefon</Text>
      <View style={global.spacingMedium}>
        <Text style={styles.formDescription}>
          Folosește formularul de mai jos pentru a-ți actualiza numărul de
          telefon.
        </Text>
        <Formik
          initialValues={initialValues(personalInfo)}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(props) => (
            <View style={global.spacingMedium}>
              <View>
                <Field
                  formikProps={props}
                  keyboardType="phone-pad"
                  label="Număr de telefon"
                  name="phone"
                  placeholder="Număr de telefon"
                />
                <ErrorMessage name="phone" />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  disabled={mutation.isPending}
                  onPress={props.handleSubmit}
                  title="Actualizează"
                />
              </View>
              <Debug formikProps={props} />
            </View>
          )}
        </Formik>
      </View>
      <CustomAlert visible={alertVisible} {...alertProps} />
    </ScrollView>
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
  heading: {
    ...theme.fontSize['2xl'],
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  formDescription: {
    ...theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[2],
  },
  buttonContainer: {
    marginTop: theme.spacing[4],
  },
});
