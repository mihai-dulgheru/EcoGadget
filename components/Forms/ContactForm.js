import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import ContactService from '../../services/ContactService';
import global from '../../styles/global';
import theme from '../../styles/theme';
import { ErrorMessage, Field } from '../Formik';
import { Button } from '../UI';

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

  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    message: useRef(null),
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
            <Field
              blurOnSubmit={false}
              formikProps={props}
              name="name"
              onSubmitEditing={() => inputRefs.email.current.focus()}
              placeholder="Nume"
              ref={inputRefs.name}
              returnKeyType="next"
            />
            <ErrorMessage name="name" />
          </View>
          <View>
            <Field
              blurOnSubmit={false}
              formikProps={props}
              keyboardType="email-address"
              name="email"
              onSubmitEditing={() => inputRefs.message.current.focus()}
              placeholder="Adresa de email"
              ref={inputRefs.email}
              returnKeyType="next"
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
              ref={inputRefs.message}
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
