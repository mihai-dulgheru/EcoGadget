import Constants from 'expo-constants';
import { debounce, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import theme from '../styles/theme';

const DEFAULT_LATITUDE = 44.4268;
const DEFAULT_LONGITUDE = 26.1025;

class Geocoder {
  static apiKey = Constants.expoConfig.android.config.googleMaps.apiKey;

  static async from(address) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${Geocoder.apiKey}`
    );
    const data = await response.json();
    return data;
  }
}

export default function LocationPicker({
  initialLatitude,
  initialLongitude,
  address,
  onLocationPicked,
  style,
}) {
  const [region, setRegion] = useState({
    latitude: initialLatitude || DEFAULT_LATITUDE,
    longitude: initialLongitude || DEFAULT_LONGITUDE,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });

  const fetchCoordinates = debounce(async (locationAddress) => {
    try {
      const json = await Geocoder.from(locationAddress);
      const { results } = json;
      if (isEmpty(results)) {
        return;
      }
      const { location } = results[0].geometry;
      setRegion({
        ...region,
        latitude: location.lat,
        longitude: location.lng,
      });
      setMarker({
        latitude: location.lat,
        longitude: location.lng,
      });
      onLocationPicked(location.lat, location.lng);
    } catch (error) {
      console.warn(error);
    }
  }, 500); // debounce with a 500ms delay

  useEffect(() => {
    if (address) {
      fetchCoordinates(address);
    }
  }, [address]);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    onLocationPicked(latitude, longitude);
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={[styles.map, style]}
        region={region}
        onPress={handleMapPress}
        onRegionChangeComplete={setRegion}
      >
        {marker.latitude && marker.longitude && <Marker coordinate={marker} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
  },
});