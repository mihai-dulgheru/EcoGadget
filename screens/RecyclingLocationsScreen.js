import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
            <Text style={styles.locationSchedule}>{todaySchedule}</Text>
            <Text style={styles.locationDistance}>{item.distance}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          A apărut o eroare la încărcarea locațiilor
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={locations}
      renderItem={renderLocation}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: theme.colors.secondary,
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: theme.spacing['6'],
  },
  locationContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: theme.spacing['6'],
    marginHorizontal: theme.spacing['6'],
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationImage: {
    height: 'full',
    marginRight: theme.spacing['6'],
    width: theme.spacing['28'],
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationName: {
    ...theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing['2'],
  },
  locationAddress: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['1'],
  },
  locationSchedule: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['1'],
  },
  locationDistance: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing['1'],
  },
});
