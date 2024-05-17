import { Formik } from 'formik';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import ContactService from '../../services/ContactService';
import global from '../../styles/global';
import theme from '../../styles/theme';
import Button from '../UI/Button';
import ErrorMessage from './ErrorMessage';
import Field from './Field';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Numele este obligatoriu'),
  email: Yup.string()
    .email('Adresa de email nu este validă')
    .required('Adresa de email este obligatorie'),
  message: Yup.string().required('Mesajul este obligatoriu'),
});

export default function ContactForm({ debug = false, locationId }) {
  const [status, setStatus] = useState('idle');

  const initialValues = {
    name: '',
    email: '',
    message: '',
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      setStatus('loading');
      await ContactService.sendContactMessage({ ...values, locationId });
      Alert.alert('Succes', 'Mesajul a fost trimis cu succes!');
      resetForm();
      setStatus('success');
    } catch (error) {
      Alert.alert(
        'Eroare',
        error.message || 'A apărut o eroare la trimiterea mesajului'
      );
      console.error('Submission error', error);
      setStatus('error');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(props) => (
        <View style={styles.formContainer}>
          <View>
            <Field formikProps={props} name="name" placeholder="Nume" />
            <ErrorMessage name="name" />
          </View>
          <View>
            <Field
              formikProps={props}
              keyboardType="email-address"
              name="email"
              placeholder="Adresa de email"
            />
            <ErrorMessage name="email" />
          </View>
          <View>
            <Field
              formikProps={props}
              multiline
              name="message"
              numberOfLines={4}
              placeholder="Mesaj"
            />
            <ErrorMessage name="message" />
          </View>
          <Button disabled={status === 'loading'} onPress={props.handleSubmit}>
            Trimite
          </Button>
          {debug && (
            <Text style={global.debugContainer}>
              {JSON.stringify(props, null, 2)}
            </Text>
          )}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: theme.spacing['4'],
  },
});
