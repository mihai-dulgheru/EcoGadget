import { Text, View } from 'react-native';
import { Button } from '../components/UI';

export default function MessageListScreen({ navigation }) {
  return (
    <View>
      <Text>Lista Mesajelor Utilizatorilor</Text>
      {/* Lista mesajelor cu butoane pentru vizualizare detalii */}
      <Button onPress={() => navigation.navigate('MessageDetail')}>
        Detalii Mesaj
      </Button>
    </View>
  );
}
