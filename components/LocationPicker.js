import { debounce, get, isEmpty, isFunction } from 'lodash';
import { forwardRef, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Geocoder } from '../classes';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants';
import theme from '../styles/theme';

const PRECISION = 0.0001;

const LocationPicker = forwardRef(
  (
    {
      formikProps,
      initialAddress,
      initialLatitude,
      initialLongitude,
      label,
      name,
      onAddressChange,
      onLocationPicked,
      placeholder,
      ...props
    },
    ref
  ) => {
    const error = get(formikProps.errors, name);
    const touched = get(formikProps.touched, name);

    const mapViewRef = useRef(null);

    const [region, setRegion] = useState({
      latitude: initialLatitude || DEFAULT_LATITUDE,
      longitude: initialLongitude || DEFAULT_LONGITUDE,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    const [marker, setMarker] = useState({
      latitude: initialLatitude || DEFAULT_LATITUDE,
      longitude: initialLongitude || DEFAULT_LONGITUDE,
    });

    const [address, setAddress] = useState(initialAddress || '');

    const updateRegionAndMarker = (latitude, longitude) => {
      const updatedRegion = {
        latitude,
        longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      };

      setMarker({ latitude, longitude });
      setRegion(updatedRegion);
      mapViewRef.current?.animateToRegion(updatedRegion, 1000);

      if (isFunction(onLocationPicked)) {
        onLocationPicked(latitude, longitude);
      }
    };

    const handleMapPress = (event) => {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      updateRegionAndMarker(latitude, longitude);
    };

    const areRegionsDifferent = (region1, region2, precision) =>
      Math.abs(region1.latitudeDelta - region2.latitudeDelta) > precision ||
      Math.abs(region1.longitudeDelta - region2.longitudeDelta) > precision;

    const handleRegionChangeComplete = (newRegion) => {
      if (areRegionsDifferent(region, newRegion, PRECISION)) {
        setRegion(newRegion);
      }
    };

    const onDragEnd = (event) => {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      updateRegionAndMarker(latitude, longitude);
    };

    const fetchCoordinates = debounce(async (locationAddress) => {
      try {
        const json = await Geocoder.from(locationAddress);
        const { results } = json;
        if (isEmpty(results)) {
          return;
        }
        const { location } = results[0].geometry;
        updateRegionAndMarker(location.lat, location.lng);
      } catch (fetchError) {
        console.warn(fetchError);
      }
    }, 500);

    const handleAddressChange = (text) => {
      setAddress(text);
      fetchCoordinates(text);
      if (isFunction(onAddressChange)) {
        onAddressChange(text);
      }
    };

    return (
      <View>
        {label && (
          <Text
            style={[styles.label, touched && !!error && styles.labelInvalid]}
          >
            {label}
          </Text>
        )}
        <View style={styles.container}>
          <MapView
            initialRegion={region}
            onPoiClick={handleMapPress}
            onPress={handleMapPress}
            onRegionChangeComplete={handleRegionChangeComplete}
            provider={PROVIDER_GOOGLE}
            ref={mapViewRef}
            style={styles.map}
          >
            <Marker coordinate={marker} draggable onDragEnd={onDragEnd} />
          </MapView>
          <TextInput
            autoCapitalize="none"
            onChangeText={handleAddressChange}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            ref={ref}
            style={styles.input}
            value={address}
            {...props}
          />
        </View>
      </View>
    );
  }
);

export default LocationPicker;

const styles = StyleSheet.create({
  label: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[1],
  },
  labelInvalid: {
    color: theme.colors.error,
  },
  container: {
    borderRadius: theme.borderRadius.lg,
    height: theme.spacing[80],
    overflow: 'hidden',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    ...theme.fontSize.base,
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    bottom: theme.spacing[1.5],
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    justifyContent: 'center',
    left: theme.spacing[1.5],
    minHeight: theme.spacing[12],
    overflow: 'hidden',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    position: 'absolute',
    right: theme.spacing[1.5],
    textAlignVertical: 'center',
    zIndex: 1,
  },
});
