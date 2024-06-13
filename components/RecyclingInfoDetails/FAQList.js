import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function FAQList({ faqs }) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Întrebări frecvente</Text>
      <View>
        {faqs.map((faq) => (
          <View key={faq._id} style={styles.faq}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing[4],
  },
  heading: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  faq: {
    gap: theme.spacing[2],
  },
  question: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  answer: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
