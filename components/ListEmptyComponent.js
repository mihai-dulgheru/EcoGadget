import { Image, StyleSheet, Text, View } from 'react-native';
import theme from '../styles/theme';

export default function ListEmptyComponent() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/empty-list.png')}
        style={styles.image}
      />
      <Text style={styles.text}>Nu există elemente de afișat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing['4'],
  },
  image: {
    width: theme.spacing['56'],
    height: theme.spacing['56'],
    marginBottom: theme.spacing['4'],
  },
  text: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
  },
});
