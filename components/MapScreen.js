import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import markerIcon from '../assets/location-dot.png';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants';
import theme from '../styles/theme';

function CustomMarker({ isSelected }) {
  return (
    <Image
      source={markerIcon}
      style={{
        height: Math.floor(2132 / 48),
        tintColor: isSelected ? theme.colors.primary : theme.colors.secondary,
        width: Math.floor(1604 / 48),
      }}
    />
  );
}

export default function MapScreen({
  currentPosition,
  filteredLocations,
  setSelectedLocation,
  bottomSheetRef,
  selectedLocation,
}) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: currentPosition?.coords.latitude || DEFAULT_LATITUDE,
        longitude: currentPosition?.coords.longitude || DEFAULT_LONGITUDE,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onPress={() => {
        setSelectedLocation(null);
        bottomSheetRef.current?.snapToIndex(0);
      }}
    >
      {filteredLocations.map((location) => (
        <Marker
          key={location._id}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          onPress={() => {
            setSelectedLocation(location);
            bottomSheetRef.current?.snapToIndex(1);
          }}
        >
          <CustomMarker isSelected={selectedLocation?._id === location._id} />
          <Callout>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>{location.name}</Text>
              <Text style={styles.calloutDescription}>{location.address}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    padding: theme.spacing[2],
    width: theme.spacing[48],
  },
  calloutTitle: {
    ...theme.fontSize.base,
    fontFamily: theme.fontFamily.heading,
  },
  calloutDescription: {
    ...theme.fontSize.sm,
    fontFamily: theme.fontFamily.body,
  },
});
