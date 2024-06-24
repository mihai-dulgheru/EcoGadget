import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MapScreen } from '../components';
import { RecyclingScheduleView } from '../components/RecyclingLocationList';
import {
  Button,
  Error,
  IconButton,
  Loading,
  SearchBar,
} from '../components/UI';
import { RIPPLE_CONFIG } from '../constants';
import RecyclingService from '../services/RecyclingService';
import global from '../styles/global';
import theme from '../styles/theme';

export default function RecyclingLocationsScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

  const {
    data: locations,
    error,
    isPending,
  } = useQuery({
    queryKey: ['recyclingLocations'],
    queryFn: async () => {
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      if (permissionResponse?.status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition(location);
      return RecyclingService.getRecyclingLocations(location.coords);
    },
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleCenterMap = () => {
    if (mapRef.current && currentPosition) {
      mapRef.current.animateToRegion({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchText('');
  }, []);

  const filteredLocations = useMemo(
    () =>
      locations?.filter((location) =>
        location.name.toLowerCase().includes(searchText.toLowerCase())
      ) || [],
    [locations, searchText]
  );

  const renderLocation = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => {
          navigation.navigate('RecyclingCenterDetails', { center: item });
        }}
      >
        <View style={styles.locationContainer}>
          <Image source={{ uri: item.image }} style={styles.locationImage} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
            <Text style={styles.locationDistance}>{item.distance}</Text>
          </View>
        </View>
      </Pressable>
    ),
    [navigation]
  );

  const renderSelectedLocation = useCallback(
    (location) => (
      <View style={styles.selectedLocationContainer}>
        <Image
          source={{ uri: location.image }}
          style={styles.selectedLocationImage}
        />
        <View>
          <Text style={styles.selectedLocationName}>{location.name}</Text>
          <View style={styles.locationInfoRow}>
            <Ionicons
              name="location-outline"
              size={22}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.selectedLocationAddress}>
              {location.address}
            </Text>
          </View>
          <View style={styles.locationInfoRow}>
            <Ionicons
              name="navigate-outline"
              size={22}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.selectedLocationDistance}>
              {location.distance}
            </Text>
          </View>
          <View style={styles.locationInfoRow}>
            <Ionicons
              name="time-outline"
              size={22}
              color={theme.colors.textSecondary}
            />
            <RecyclingScheduleView schedule={location.schedule} />
          </View>
          <View style={[styles.locationInfoRow, { borderBottomWidth: 0 }]}>
            <Ionicons
              name="call-outline"
              size={22}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.selectedLocationPhone}>{location.phone}</Text>
          </View>
        </View>
        <View>
          <Button
            title="Detalii"
            onPress={() => {
              navigation.navigate('RecyclingCenterDetails', {
                center: location,
              });
            }}
          />
        </View>
      </View>
    ),
    [navigation]
  );

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <MapScreen
        bottomSheetRef={bottomSheetRef}
        currentPosition={currentPosition}
        filteredLocations={filteredLocations}
        ref={mapRef}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      <View style={styles.searchContainer}>
        <SearchBar
          onChangeText={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Caută după nume"
        />
      </View>
      <IconButton
        android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[7] }}
        color={theme.colors.primary}
        extraStyles={{
          button: styles.mapCenterButton,
          pressed: styles.mapCenterButtonPressed,
        }}
        icon="locate"
        onPress={handleCenterMap}
        size={24}
      />
      {!isKeyboardVisible && (
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetFlatList
            contentContainerStyle={styles.contentContainer}
            data={selectedLocation ? [selectedLocation] : filteredLocations}
            keyExtractor={(item) => item._id.toString()}
            renderItem={
              selectedLocation
                ? () => renderSelectedLocation(selectedLocation)
                : renderLocation
            }
          />
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    ...global.spacingMedium,
    flexGrow: 1,
    padding: theme.spacing[4],
  },
  listContainer: {
    flexGrow: 1,
  },
  locationAddress: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  locationContainer: {
    ...global.spacingSmall,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    padding: theme.spacing[2],
  },
  locationDistance: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  locationImage: {
    borderRadius: theme.borderRadius.md,
    objectFit: 'cover',
    width: theme.spacing[32],
  },
  locationInfo: {
    flex: 1,
  },
  locationInfoRow: {
    ...global.spacingSmall,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: theme.borderWidth.default,
    flexDirection: 'row',
    paddingVertical: theme.spacing[2],
  },
  locationName: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  searchContainer: {
    ...global.spacingSmall,
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    padding: theme.spacing[4],
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  mapCenterButton: {
    ...theme.shadow.md,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth.default,
    bottom: '27.5%',
    justifyContent: 'center',
    padding: theme.spacing[4],
    position: 'absolute',
    right: theme.spacing[4],
  },
  mapCenterButtonPressed: {
    opacity: theme.opacity.default,
  },
  selectedLocationAddress: {
    ...theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  selectedLocationContainer: {
    ...global.spacingMedium,
    padding: theme.spacing[2],
  },
  selectedLocationDistance: {
    ...theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  selectedLocationImage: {
    borderRadius: theme.borderRadius.md,
    height: 200,
    width: '100%',
  },
  selectedLocationName: {
    ...theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginBottom: theme.spacing[2],
  },
  selectedLocationPhone: {
    ...theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
