import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import ContactService from '../../services/ContactService';
import theme from '../../styles/theme';
import { Debug, ErrorMessage, Field } from '../Formik';
import { Button, CustomAlert } from '../UI';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Numele este obligatoriu'),
  email: Yup.string()
    .email('Adresa de email nu este validă')
    .required('Adresa de email este obligatorie'),
  message: Yup.string().required('Mesajul este obligatoriu'),
});

const initialValues = {
  name: '',
  email: '',
  message: '',
};

export default function ContactForm({ debug = false, locationId }) {
  const [status, setStatus] = useState('idle');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    message: useRef(null),
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

  const onSubmit = async (values, { resetForm }) => {
    try {
      setStatus('loading');
      await ContactService.sendContactMessage({ ...values, locationId });
      showAlert('Succes', 'Mesajul a fost trimis cu succes', 'OK', () => {
        setAlertVisible(false);
        resetForm();
        setStatus('success');
      });
    } catch (error) {
      showAlert(
        'Eroare',
        error.message || 'A apărut o eroare la trimiterea mesajului',
        'OK',
        () => setAlertVisible(false)
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
          <Button
            title="Trimite"
            disabled={status === 'loading'}
            onPress={props.handleSubmit}
          />
          <Debug debug={debug} formikProps={props} />
          <CustomAlert visible={alertVisible} {...alertProps} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: theme.spacing[4],
  },
});
