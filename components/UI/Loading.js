import { ActivityIndicator, StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
    justifyContent: 'center',
  },
});
