import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Error, Loading } from '../components/UI';
import RecyclingService from '../services/RecyclingService';
import theme from '../styles/theme';

export default function RecyclingLocationsScreen({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const permissionResponse =
          await Location.requestForegroundPermissionsAsync();
        if (permissionResponse?.status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }
        const location = await Location.getCurrentPositionAsync({});
        const data = await RecyclingService.getRecyclingLocations(
          location.coords
        );
        setLocations(data);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching locations', error);
        setStatus('error');
      }
    };

    fetchLocations();
  }, []);

  const renderLocation = ({ item }) => {
    const daysOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const currentDay = daysOfWeek[new Date().getDay()];

    const todaySchedule = item.schedule[currentDay.toLowerCase()] || 'Closed';

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('RecyclingCenterDetails', {
            center: item,
          });
        }}
      >
        <View style={styles.locationContainer}>
          <Image
            defaultSource={require('../assets/images/placeholder.jpg')}
            source={{ uri: item.image }}
            style={styles.locationImage}
          />
          <View style={styles.locationInfo}>
            <Text style={styles.locationSchedule}>{todaySchedule}</Text>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
            <Text style={styles.locationDistance}>{item.distance}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error message="A apărut o eroare la încărcarea locațiilor" />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={locations}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderLocation}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    gap: theme.spacing['4'],
    padding: theme.spacing['4'],
  },
  locationContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    gap: theme.spacing['4'],
    padding: theme.spacing['2'],
  },
  locationImage: {
    borderRadius: theme.borderRadius.md,
    height: 'full',
    width: theme.spacing['32'],
  },
  locationInfo: {
    gap: theme.spacing['0.5'],
  },
  locationSchedule: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  locationName: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  locationAddress: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  locationDistance: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
