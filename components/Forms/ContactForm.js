import { Formik } from 'formik';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import * as Yup from 'yup';
import ContactService from '../../services/ContactService';
import theme from '../../styles/theme';
import Button from '../UI/Button';
import ErrorMessage from './ErrorMessage';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Numele este obligatoriu'),
  email: Yup.string()
    .email('Adresa de email nu este validă')
    .required('Adresa de email este obligatorie'),
  message: Yup.string().required('Mesajul este obligatoriu'),
});

export default function ContactForm({ locationId }) {
  const initialValues = {
    name: '',
    email: '',
    message: '',
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      await ContactService.sendContactMessage({ ...values, locationId });
      resetForm();
      Alert.alert('Succes', 'Mesajul a fost trimis cu succes!');
    } catch (error) {
      Alert.alert(
        'Eroare',
        error.message || 'A apărut o eroare la trimiterea mesajului'
      );
      console.error('Submission error', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.formContainer}>
          <View>
            <TextInput
              style={styles.input}
              onBlur={handleBlur('name')}
              onChangeText={handleChange('name')}
              value={values.name}
              placeholder="Nume"
            />
            <ErrorMessage name="name" />
          </View>
          <View>
            <TextInput
              style={styles.input}
              onBlur={handleBlur('email')}
              onChangeText={handleChange('email')}
              value={values.email}
              placeholder="Adresa de email"
              keyboardType="email-address"
            />
            <ErrorMessage name="email" />
          </View>
          <View>
            <TextInput
              style={[styles.input, styles.textArea]}
              onBlur={handleBlur('message')}
              onChangeText={handleChange('message')}
              value={values.message}
              placeholder="Mesaj"
              multiline
            />
            <ErrorMessage name="message" />
          </View>
          <Button onPress={handleSubmit}>Trimite</Button>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: theme.spacing['4'],
  },
  input: {
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
  },
  textArea: {
    height: theme.spacing['24'],
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
