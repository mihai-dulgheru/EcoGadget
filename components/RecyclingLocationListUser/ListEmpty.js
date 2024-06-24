import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function ListEmpty({ searchText }) {
  if (!searchText) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emptyText}>Nu s-au găsit rezultate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing[1],
  },
  emptyText: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
