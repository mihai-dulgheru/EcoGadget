import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { defaultTo } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import markerIcon from '../assets/images/location-dot.png';
import {
  ItemSeparator,
  ListEmpty,
  LocationItem,
  SearchResultItem,
  SelectedLocationItem,
} from '../components/RecyclingLocationListUser';
import { Error, IconButton, Loading, SearchBar } from '../components/UI';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  RIPPLE_CONFIG,
} from '../constants';
import RecyclingService from '../services/RecyclingService';
import global from '../styles/global';
import theme from '../styles/theme';

export default function RecyclingLocationListUserScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [region, setRegion] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

  useEffect(() => {
    const getCurrentPosition = async () => {
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      if (permissionResponse?.status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition(location);
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    };

    getCurrentPosition();
  }, []);

  const {
    data: locations,
    error,
    isPending,
  } = useQuery({
    queryKey: ['recyclingLocations'],
    queryFn: async () =>
      RecyclingService.getRecyclingLocations(currentPosition?.coords),
    enabled: !!currentPosition,
  });

  const {
    data: searchResults,
    error: searchError,
    isError: isSearchError,
    isPending: isSearchingPending,
    isSuccess: isSearchSuccess,
  } = useQuery({
    queryKey: ['searchRecyclingLocations', searchText],
    queryFn: async () =>
      RecyclingService.searchRecyclingLocations(
        currentPosition?.coords,
        searchText
      ),
    enabled: !!currentPosition && isSearching && searchText.trim().length > 0,
  });

  const handleCenterMap = useCallback(() => {
    if (mapRef.current && currentPosition) {
      mapRef.current.animateToRegion({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [currentPosition]);

  const renderLocation = useCallback(
    ({ item }) => (
      <LocationItem
        item={item}
        onPress={() =>
          navigation.navigate('RecyclingCenterDetailUser', { center: item })
        }
      />
    ),
    [navigation]
  );

  const renderSelectedLocation = useCallback(
    () => (
      <SelectedLocationItem
        item={selectedLocation}
        onPress={() =>
          navigation.navigate('RecyclingCenterDetailUser', {
            center: selectedLocation,
          })
        }
      />
    ),
    [navigation, selectedLocation]
  );

  const renderSearchResult = useCallback(
    ({ item }) => (
      <SearchResultItem
        item={item}
        onPress={() => {
          navigation.navigate('RecyclingCenterDetailUser', { center: item });
        }}
      />
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
      {!isSearching && (
        <>
          <MapView
            initialRegion={region}
            onPress={() => {
              setSelectedLocation(null);
              bottomSheetRef.current?.snapToIndex(0);
            }}
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
          >
            {locations.map((location) => (
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
                // tracksViewChanges={false}
              >
                <Image source={markerIcon} style={styles.markerIcon} />
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{location.name}</Text>
                    <Text style={styles.calloutDescription}>
                      {location.address}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
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
        </>
      )}
      {isSearching && (
        <View style={styles.searchResultsContainer}>
          {isSearchError && (
            <View style={styles.horizontalPadding}>
              <Text style={styles.error}>{searchError.message}</Text>
            </View>
          )}
          {isSearchingPending && searchText.trim().length > 0 && (
            <View style={[styles.horizontalPadding, styles.verticalPadding]}>
              <Loading />
            </View>
          )}
          {isSearchSuccess && (
            <FlatList
              data={defaultTo(searchResults, [])}
              ItemSeparatorComponent={ItemSeparator}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item._id.toString()}
              ListEmptyComponent={<ListEmpty searchText={searchText} />}
              renderItem={renderSearchResult}
              style={global.grow}
            />
          )}
        </View>
      )}
      <View style={styles.searchContainer}>
        <SearchBar
          onBack={() => {
            setIsSearching(false);
            setSearchText('');
            setSelectedLocation(null);
          }}
          onChangeText={setSearchText}
          onClear={() => setSearchText('')}
          onFocus={() => setIsSearching(true)}
          placeholder="Caută după nume"
        />
      </View>
      {!isSearching && (
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetFlatList
            contentContainerStyle={styles.contentContainer}
            data={defaultTo(
              selectedLocation ? [selectedLocation] : locations,
              []
            )}
            keyExtractor={(item) => item._id.toString()}
            renderItem={
              selectedLocation ? renderSelectedLocation : renderLocation
            }
          />
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  markerIcon: {
    height: Math.floor(2132 / 48),
    marginBottom: theme.spacing[0.5],
    tintColor: theme.colors.primary,
    width: Math.floor(1604 / 48),
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
  contentContainer: {
    ...global.spacingMedium,
    flexGrow: 1,
    padding: theme.spacing[4],
  },
  searchContainer: {
    ...global.spacingSmall,
    alignItems: 'center',
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
  searchResultsContainer: {
    marginTop: theme.spacing[20],
    paddingHorizontal: theme.spacing[3],
  },
  error: {
    ...theme.fontSize.base,
    color: theme.colors.error,
    fontFamily: theme.fontFamily.body,
  },
  horizontalPadding: {
    paddingHorizontal: theme.spacing[1],
  },
  verticalPadding: {
    paddingVertical: theme.spacing[4],
  },
});
