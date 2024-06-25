import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MapScreen } from '../components';
import {
  ItemSeparator,
  ListEmpty,
  LocationItem,
  SearchResultItem,
  SelectedLocationItem,
} from '../components/RecyclingLocationListUser';
import { Error, IconButton, Loading, SearchBar } from '../components/UI';
import { RIPPLE_CONFIG } from '../constants';
import { useRecyclingLocations } from '../hooks/useRecyclingLocations';
import global from '../styles/global';
import theme from '../styles/theme';

export default function RecyclingLocationListUserScreen({ navigation }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

  const {
    currentPosition,
    locations,
    error,
    isPending,
    searchResults,
    searchError,
    isSearchError,
    isSearchingPending,
    isSearchSuccess,
  } = useRecyclingLocations(isSearching, searchText);

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
    (item) => (
      <SelectedLocationItem
        item={item}
        onPress={() =>
          navigation.navigate('RecyclingCenterDetailUser', { center: item })
        }
      />
    ),
    [navigation]
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
          <MapScreen
            bottomSheetRef={bottomSheetRef}
            currentPosition={currentPosition}
            locations={locations}
            ref={mapRef}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
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
          {isSearchingPending && (
            <View style={[styles.horizontalPadding, styles.verticalPadding]}>
              <Loading />
            </View>
          )}
          {isSearchSuccess && (
            <FlatList
              data={searchResults}
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
            data={selectedLocation ? [selectedLocation] : locations}
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
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
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
