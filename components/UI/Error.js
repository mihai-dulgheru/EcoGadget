import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function Error({ message = 'A apărut o eroare' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.error}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  error: {
    ...theme.fontSize.base,
    color: theme.colors.error,
    padding: theme.spacing['4'],
  },
});
