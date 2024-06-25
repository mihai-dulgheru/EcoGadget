import Ionicons from '@expo/vector-icons/Ionicons';
import { Formik } from 'formik';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import { ErrorMessage, Field } from '../components/Formik';
import { Button, CustomAlert } from '../components/UI';
import global from '../styles/global';
import theme from '../styles/theme';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresa de email nu este validă')
    .required('Adresa de email este obligatorie'),
});

export default function ForgotPasswordScreen({ navigation }) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const showAlert = (title, message, confirmText, onConfirm) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
    });
    setAlertVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      // Logică pentru trimiterea email-ului
      navigation.navigate('ConfirmCode');
    } catch (error) {
      showAlert('Eroare', error.message, 'OK', () => setAlertVisible(false));
    }
  };

  return (
    <Formik
      initialValues={{ email: '' }}
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
            Introdu adresa de email pentru a reseta parola contului tău.
          </Text>
          <View>
            <Field
              formikProps={props}
              keyboardType="email-address"
              label="Adresă email"
              name="email"
              placeholder="Introdu adresa de email"
              returnKeyType="done"
            />
            <ErrorMessage name="email" />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Continuare" onPress={props.handleSubmit} />
          </View>
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
