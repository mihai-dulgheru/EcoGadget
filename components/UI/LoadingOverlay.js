import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

function LoadingOverlay({ message }) {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing['8'],
  },
  message: {
    ...theme.fontSize.base,
    marginBottom: theme.spacing['4'],
  },
});
