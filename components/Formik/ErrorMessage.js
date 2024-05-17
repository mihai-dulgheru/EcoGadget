import { useFormikContext } from 'formik';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function ErrorMessage({ name }) {
  const { touched, errors } = useFormikContext();
  const fieldError = touched[name] && errors[name];

  if (!fieldError) {
    return null;
  }

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{fieldError}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    marginTop: theme.spacing['2'],
  },
  errorText: {
    ...theme.fontSize.sm,
    color: theme.colors.error,
  },
});