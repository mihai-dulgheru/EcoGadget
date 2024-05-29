import { Text, View } from 'react-native';
import { Button } from '../components/UI';

export default function RecyclingLocationListScreen({ navigation }) {
  return (
    <View>
      <Text>Lista Locațiilor de Reciclare</Text>
      <Button
        title="Adaugă Locație"
        onPress={() => navigation.navigate('RecyclingLocationEdit')}
      />
      {/* Lista locațiilor cu butoane pentru editare și ștergere */}
    </View>
  );
}
