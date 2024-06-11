import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RecyclingScheduleView } from '../components/RecyclingLocationList';
import {
  Error,
  IconButton,
  ListEmptyComponent,
  Loading,
} from '../components/UI';
import RecyclingManagerService from '../services/RecyclingManagerService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function RecyclingLocationListScreen({ navigation, route }) {
  const { dataUpdatedAt } = route.params || {};
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState('loading');
  const AxiosAuth = useAxiosAuth();

  async function fetchLocations() {
    try {
      setStatus('loading');
      const data =
        await RecyclingManagerService.getRecyclingLocations(AxiosAuth);
      setLocations(data);
      setStatus('success');
    } catch (error) {
      console.error('Error loading locations:', error);
      setStatus('error');
    }
  }

  useEffect(() => {
    fetchLocations();
  }, [dataUpdatedAt]);

  const handleAddButtonPress = () => {
    navigation.navigate('RecyclingLocationEdit', { location: {} });
  };

  const handleEdit = (location) => {
    navigation.navigate('RecyclingLocationEdit', { location });
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmă ștergerea',
      'Ești sigur că vrei să ștergi această locație?',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Șterge',
          onPress: async () => {
            try {
              setStatus('loading');
              await RecyclingManagerService.deleteRecyclingLocation(
                AxiosAuth,
                id
              );
              await fetchLocations();
              setStatus('success');
            } catch (error) {
              console.error('Error deleting location:', error);
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
    return <Error message="A apărut o eroare la încărcarea locațiilor" />;
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
        data={locations}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => handleEdit(item)}>
            <View style={styles.locationItem}>
              <Image
                defaultSource={require('../assets/images/placeholder.jpg')}
                source={{ uri: item.image }}
                style={styles.locationImage}
              />
              <Text style={styles.locationTitle}>{item.name}</Text>
              <RecyclingScheduleView schedule={item.schedule} />
              <View style={styles.addressContainer}>
                <Ionicons
                  name="location"
                  color={theme.colors.textSecondary}
                  size={24}
                />
                <Text style={styles.addressText}>{item.address}</Text>
              </View>
              <View style={styles.locationDeleteButton}>
                <IconButton
                  icon="trash"
                  color={theme.colors.textSecondary}
                  size={24}
                  onPress={() => handleDelete(item._id)}
                />
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
  locationItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing['2'],
    padding: theme.spacing['2'],
  },
  locationImage: {
    aspectRatio: 4 / 3,
    borderRadius: theme.borderRadius.md,
  },
  locationTitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  addressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing['1'],
  },
  addressText: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  locationDeleteButton: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.full,
    height: theme.spacing['10'],
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing['4'],
    top: theme.spacing['4'],
  },
});
