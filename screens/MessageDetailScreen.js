import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { Debug, ErrorMessage, Field } from '../components/Formik';
import { Button, Loading } from '../components/UI';
import RecyclingManagerService from '../services/RecyclingManagerService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const validationSchema = Yup.object().shape({
  response: Yup.string().trim().required('Răspunsul este obligatoriu'),
});

const initialValues = {
  response: '',
};

export default function MessageDetailScreen({ route, navigation }) {
  const { message } = route.params || {};
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const sendMessageResponse = useCallback(
    async (response) => {
      await RecyclingManagerService.sendMessageResponse(
        AxiosAuth,
        message._id,
        response
      );
    },
    [AxiosAuth, message._id]
  );

  const mutation = useMutation({
    mutationFn: sendMessageResponse,
    onSuccess: () => {
      Alert.alert('Succes', 'Răspunsul a fost trimis cu succes');
      queryClient.invalidateQueries(['messages']);
      navigation.navigate('MessageList', { dataUpdatedAt: Date.now() });
    },
    onError: (error) => {
      Alert.alert(
        'Eroare',
        error.message || 'A apărut o eroare la trimiterea răspunsului'
      );
    },
  });

  const handleSubmit = useCallback(
    async (values, { resetForm }) => {
      await mutation.mutateAsync(values.response);
      resetForm();
    },
    [mutation]
  );

  if (mutation.isPending) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>Detalii Mesaj</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Nume:</Text>
        <Text style={styles.text}>{message.name}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{message.email}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mesaj:</Text>
        <Text style={styles.text}>{message.message}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Răspuns:</Text>
        {message.response ? (
          <Text style={styles.text}>{message.response}</Text>
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(props) => (
              <View style={styles.formContainer}>
                <View>
                  <Field
                    formikProps={props}
                    multiline
                    name="response"
                    numberOfLines={4}
                    placeholder="Introduceți răspunsul dvs. aici"
                    style={styles.textInput}
                  />
                  <ErrorMessage name="response" />
                </View>
                <Button
                  disabled={mutation.isPending}
                  onPress={props.handleSubmit}
                  title="Trimite Răspunsul"
                />
                <Debug formikProps={props} />
              </View>
            )}
          </Formik>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing['4'],
    gap: theme.spacing['4'],
  },
  header: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing['2'],
  },
  detailContainer: {
    marginBottom: theme.spacing['2'],
  },
  label: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing['1'],
  },
  text: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['2'],
  },
  formContainer: {
    gap: theme.spacing['8'],
  },
  textInput: {
    ...theme.fontSize.base,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.textPrimary,
    padding: theme.spacing['2'],
    textAlignVertical: 'top',
    minHeight: theme.spacing['24'],
    maxHeight: theme.spacing['48'],
  },
  buttonContainer: {
    marginTop: theme.spacing['4'],
  },
});
