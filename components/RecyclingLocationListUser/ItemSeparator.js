import { StyleSheet, View } from 'react-native';
import theme from '../../styles/theme';

export default function ItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

const styles = StyleSheet.create({
  itemSeparator: {
    borderBottomWidth: theme.borderWidth.default,
    borderColor: theme.colors.border,
    marginVertical: theme.spacing[2],
  },
});
