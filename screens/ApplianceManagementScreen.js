import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  Error,
  FlatButton,
  IconButton,
  ListEmptyComponent,
  Loading,
  Pill,
} from '../components/UI';
import ApplianceService from '../services/ApplianceService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function ApplianceManagementScreen({ navigation, route }) {
  const { dataUpdatedAt } = route.params || {};
  const [appliances, setAppliances] = useState([]);
  const [status, setStatus] = useState('loading');
  const AxiosAuth = useAxiosAuth();

  async function fetchAppliances() {
    try {
      setStatus('loading');
      const data = await ApplianceService.getAppliances(AxiosAuth);
      setAppliances(data);
      setStatus('success');
    } catch (error) {
      console.error('Error loading appliances:', error);
      setStatus('error');
    }
  }

  useEffect(() => {
    fetchAppliances();
  }, [dataUpdatedAt]);

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
            try {
              setStatus('loading');
              await ApplianceService.deleteAppliance(AxiosAuth, id);
              await fetchAppliances();
              setStatus('success');
            } catch (error) {
              console.error('Error deleting appliance:', error);
              setStatus('error');
            }
          },
        },
      ]
    );
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return (
      <Error message="A apărut o eroare la încărcarea informațiilor despre aparate" />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.addButton}>
        <IconButton
          color="white"
          icon="add"
          onPress={handleAddButtonPress}
          size={28}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={appliances}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => handleEdit(item)}>
            <View style={styles.item}>
              <View style={styles.row}>
                <Text style={styles.title}>{item.name}</Text>
                <Pill color="green">{item.efficiencyRating}</Pill>
              </View>
              <Text style={styles.text}>
                {`Consum de energie: ${item.energyUsage} kWh/an`}
              </Text>
              <Text style={styles.text}>
                {`Emisii CO2: ${item.CO2Emissions} kg/an`}
              </Text>
              <View style={styles.actionButtons}>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Editează"
                    color="secondary"
                    onPress={() => handleEdit(item)}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <FlatButton
                    extraStyles={{ buttonText: styles.buttonTextDelete }}
                    onPress={() => handleDelete(item._id)}
                  >
                    Șterge
                  </FlatButton>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth.default,
    bottom: theme.spacing['4'],
    height: theme.spacing['14'],
    justifyContent: 'center',
    padding: theme.spacing['1'],
    position: 'absolute',
    right: theme.spacing['4'],
    width: theme.spacing['14'],
    zIndex: 1,
  },
  listContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    gap: theme.spacing['4'],
    padding: theme.spacing['4'],
  },
  item: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing['2'],
    padding: theme.spacing['2'],
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing['2'],
  },
  title: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  text: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing['2'],
    gap: theme.spacing['2'],
  },
  buttonContainer: {
    width: '48%',
  },
  buttonTextDelete: {
    ...theme.fontSize.sm,
    color: theme.colors.error,
    textAlign: 'center',
  },
});
