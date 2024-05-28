import { Text, View } from 'react-native';
import { Button } from '../components/UI';

export default function RecyclingLocationListScreen({ navigation }) {
  return (
    <View>
      <Text>Lista Locațiilor de Reciclare</Text>
      <Button onPress={() => navigation.navigate('RecyclingLocationEdit')}>
        Adaugă Locație
      </Button>
      {/* Lista locațiilor cu butoane pentru editare și ștergere */}
    </View>
  );
}
