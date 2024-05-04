import { StyleSheet, Text, View } from 'react-native';

export default function FAQList({ faqs }) {
  if (!faqs) return null;
  return (
    <View>
      {faqs.map((faq) => (
        <View key={faq._id} style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{faq.question}</Text>
          <Text>{faq.answer}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
