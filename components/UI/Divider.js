import { StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';

export default function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: theme.borderWidth.default,
  },
});
