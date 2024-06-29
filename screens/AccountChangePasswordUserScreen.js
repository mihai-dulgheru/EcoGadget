import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import { Button, CustomAlert, Loading } from '../components/UI';
import UserService from '../services/UserService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Parola trebuie să conțină cel puțin o literă mare, o literă mică, un număr și un caracter special'
    )
    .required('Parola este obligatorie'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Parolele nu se potrivesc')
    .required('Confirmarea parolei este obligatorie'),
});

const initialValues = {
  password: '',
  confirmPassword: '',
};

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
  setAlertVisible
) => {
  showAlert(
    setAlertProps,
    setAlertVisible,
    'Succes',
    'Parola a fost actualizată cu succes',
    'OK',
    async () => {
      setAlertVisible(false);
      navigation.goBack();
      await queryClient.invalidateQueries(['accountInfo']);
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

export default function AccountChangePasswordUserScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const inputRefs = {
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const mutation = useMutation({
    mutationFn: async ({ password, confirmPassword }) =>
      UserService.updatePassword(AxiosAuth, {
        password,
        confirmPassword,
      }),
    onSuccess: () =>
      handleMutationSuccess(
        queryClient,
        navigation,
        setAlertProps,
        setAlertVisible
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
      <Text style={styles.heading}>Schimbare parolă</Text>
      <View style={global.spacingMedium}>
        <Text style={styles.formDescription}>
          Introdu o nouă parolă pentru contul tău.
        </Text>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(props) => (
            <View style={global.spacingMedium}>
              <View>
                <Field
                  autoComplete="new-password"
                  autoCorrect={false}
                  blurOnSubmit={false}
                  formikProps={props}
                  label="Parolă"
                  name="password"
                  onSubmitEditing={() =>
                    inputRefs.confirmPassword.current.focus()
                  }
                  placeholder="Introdu parola"
                  ref={inputRefs.password}
                  returnKeyType="next"
                  secure
                  textContentType="newPassword"
                />
                <ErrorMessage name="password" />
              </View>
              <View>
                <Field
                  autoComplete="new-password"
                  autoCorrect={false}
                  formikProps={props}
                  label="Confirmare parolă"
                  name="confirmPassword"
                  placeholder="Introdu parola din nou"
                  ref={inputRefs.confirmPassword}
                  secure
                  textContentType="newPassword"
                />
                <ErrorMessage name="confirmPassword" />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  disabled={mutation.isPending}
                  onPress={props.handleSubmit}
                  title="Schimbă parola"
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
