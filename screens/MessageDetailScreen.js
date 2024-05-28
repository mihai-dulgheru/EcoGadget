import { Text, View } from 'react-native';

export default function MessageDetailScreen({ route }) {
  const { messageId } = route.params || {};

  return (
    <View>
      <Text>Detalii Mesaj</Text>
      <Text>{messageId}</Text>
      {/* Detalii despre mesaj */}
    </View>
  );
}
