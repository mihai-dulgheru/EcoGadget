import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RecyclingService from '../services/RecyclingService';
import colors from '../styles/colors';

export default function RecyclingLocationsScreen() {
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await RecyclingService.getRecyclingLocations();
        setLocations(data);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching locations', error);
        setStatus('error');
      }
    };

    fetchLocations();
  }, []);

  const renderLocation = ({ item }) => (
    <View style={styles.locationContainer}>
      <Image source={{ uri: item.image }} style={styles.locationImage} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <Text style={styles.locationSchedule}>{item.schedule}</Text>
        <Text style={styles.locationDistance}>{item.distance}</Text>
      </View>
    </View>
  );

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error fetching locations</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={locations}
      renderItem={renderLocation}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: colors.accent,
  },
  listContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  locationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  locationSchedule: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  locationDistance: {
    fontSize: 14,
    color: '#666',
  },
});
