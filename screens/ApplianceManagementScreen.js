import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatButton, IconButton } from '../components/UI';
import ApplianceService from '../services/ApplianceService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function ApplianceManagementScreen({ navigation }) {
  const [appliances, setAppliances] = useState([]);
  const AxiosAuth = useAxiosAuth();

  useEffect(() => {
    fetchAppliances();
  }, []);

  const fetchAppliances = async () => {
    const data = await ApplianceService.getAppliances(AxiosAuth);
    setAppliances(data);
  };

  const handleAddButtonPress = () => {
    navigation.navigate('ApplianceEdit', { appliance: {} });
  };

  const handleEdit = (appliance) => {
    navigation.navigate('ApplianceEdit', { appliance });
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmă ștergerea',
      'Ești sigur că vrei să ștergi acest aparat?',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Șterge',
          onPress: async () => {
            await ApplianceService.deleteAppliance(id);
            fetchAppliances();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.addButton}>
        <IconButton
          color={theme.colors.primary}
          icon="add"
          onPress={handleAddButtonPress}
          size={24}
        />
      </View>
      <FlatList
        data={appliances}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <View style={styles.item}>
              <Text style={styles.title}>
                {`${item.name} - ${item.efficiencyRating}`}
              </Text>
              <Text>{`Consum de energie: ${item.energyUsage} kWh/an`}</Text>
              <Text>{`Emisii CO2: ${item.CO2Emissions} kg/an`}</Text>
              <View style={styles.button}>
                <FlatButton onPress={() => handleDelete(item._id)}>
                  Șterge
                </FlatButton>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing['2'],
    paddingTop: theme.spacing['4'],
  },
  addButton: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.spacing.px,
    bottom: theme.spacing['2'],
    marginBottom: theme.spacing['2'],
    marginEnd: theme.spacing['2'],
    padding: theme.spacing['1'],
    position: 'absolute',
    right: theme.spacing['2'],
  },
  item: {
    backgroundColor: '#f9f9f9',
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    margin: theme.spacing['2'],
    padding: theme.spacing['4'],
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    ...theme.fontSize.lg,
    fontWeight: 'bold',
  },
  button: {
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.spacing.px,
    marginTop: theme.spacing['2'],
    paddingHorizontal: theme.spacing['1'],
    paddingVertical: theme.spacing['0.5'],
  },
});
