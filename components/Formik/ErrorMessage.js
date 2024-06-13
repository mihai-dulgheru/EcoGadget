import { useFormikContext } from 'formik';
import { get } from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function ErrorMessage({ name }) {
  const { touched, errors } = useFormikContext();
  const fieldError = get(touched, name) && get(errors, name);

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
    marginTop: theme.spacing[1],
  },
  errorText: {
    ...theme.fontSize.sm,
    color: theme.colors.error,
    fontFamily: theme.fontFamily.body,
  },
});
