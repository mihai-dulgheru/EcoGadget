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
  code: Yup.string()
    .required('Codul este obligatoriu')
    .matches(/^\d+$/, 'Codul trebuie să conțină doar cifre')
    .length(6, 'Codul trebuie să aibă 6 cifre'),
});

export default function ConfirmCodeScreen({ navigation }) {
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
      // Logică pentru confirmarea codului
      navigation.navigate('ResetPassword');
    } catch (error) {
      showAlert('Eroare', error.message, 'OK', () => setAlertVisible(false));
    }
  };

  return (
    <Formik
      initialValues={{ code: '' }}
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
          <Text style={styles.title}>Confirmare cod</Text>
          <Text style={styles.description}>
            Ți-am trimis un cod de confirmare pe adresa de email. Te rugăm să
            introduci codul pentru a continua.
          </Text>
          <View>
            <Field
              formikProps={props}
              keyboardType="number-pad"
              label="Cod"
              name="code"
              placeholder="Introdu codul"
              returnKeyType="done"
            />
            <ErrorMessage name="code" />
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
