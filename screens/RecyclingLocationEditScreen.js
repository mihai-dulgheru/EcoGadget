import { Text, View } from 'react-native';
import { Button, Input } from '../components/UI';

export default function RecyclingLocationEditScreen({ route }) {
  const { locationId } = route.params || {};

  return (
    <View>
      <Text>{locationId ? 'Editare Locație' : 'Adaugă Locație'}</Text>
      {/* Formular pentru adăugarea/editarea locației */}
      <Input placeholder="Nume Locație" />
      <Input placeholder="Adresă" />
      <Input placeholder="Telefon" />
      <Input placeholder="Descriere" />
      <Button onPress={() => {}}>
        {locationId ? 'Salvează Modificările' : 'Adaugă Locație'}
      </Button>
    </View>
  );
}
