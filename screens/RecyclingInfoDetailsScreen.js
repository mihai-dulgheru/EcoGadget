import { ScrollView, StyleSheet, Text } from 'react-native';
import { Section } from '../components/RecyclingInfoDetails';
import theme from '../styles/theme';

export default function RecyclingInfoDetailsScreen({ route }) {
  const { recyclingInfo } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recyclingInfo.title}</Text>
      <Text style={styles.subtitle}>{recyclingInfo.subtitle}</Text>
      {recyclingInfo.sections.map((section) => (
        <Section key={section._id} section={section} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing['4'],
  },
  title: {
    ...theme.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing['2'],
    marginTop: theme.spacing['4'],
  },
  subtitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['6'],
  },
});
