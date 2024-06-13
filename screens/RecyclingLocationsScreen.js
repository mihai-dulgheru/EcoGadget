import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  // Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MapScreen } from '../components';
import { RecyclingScheduleView } from '../components/RecyclingLocationList';
import { Button, Error, Loading, SearchBar } from '../components/UI';
import { DAYS_OF_WEEK } from '../constants';
import RecyclingService from '../services/RecyclingService';
import theme from '../styles/theme';

export default function RecyclingLocationsScreen({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [locations, setLocations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [showOpenNow, setShowOpenNow] = useState(false);
  const [status, setStatus] = useState('loading');

  // BottomSheet ref and snap points
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchText('');
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const permissionResponse =
          await Location.requestForegroundPermissionsAsync();
        if (permissionResponse?.status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }
        const location = await Location.getCurrentPositionAsync({});
        setCurrentPosition(location);
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

  // TODO: Implement filtering by open now
  // const filteredLocations = useMemo(() => {
  //   const currentDay = DAYS_OF_WEEK[new Date().getDay()];
  //   return locations.filter((location) => {
  //     const todaySchedule =
  //       location.schedule[currentDay.toLowerCase()] || 'Closed';
  //     const isOpenNow = todaySchedule !== 'Closed';
  //     return (
  //       location.name.toLowerCase().includes(searchText.toLowerCase()) &&
  //       (!showOpenNow || isOpenNow)
  //     );
  //   });
  // }, [locations, searchText, showOpenNow]);

  const filteredLocations = useMemo(
    () =>
      locations.filter((location) =>
        location.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [locations, searchText]
  );

  const renderLocation = useCallback(
    ({ item }) => (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('RecyclingCenterDetails', { center: item });
        }}
      >
        <View style={styles.locationContainer}>
          <Image
            defaultSource={require('../assets/images/placeholder.jpg')}
            source={{ uri: item.image }}
            style={styles.locationImage}
          />
          <View style={styles.locationInfo}>
            <Text style={styles.locationSchedule}>
              {item.schedule[DAYS_OF_WEEK[new Date().getDay()].toLowerCase()] ||
                'Închis'}
            </Text>
            <Text style={styles.locationName}>{item.name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
            <Text style={styles.locationDistance}>{item.distance}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ),
    [navigation]
  );

  const renderSelectedLocation = useCallback(
    (location) => (
      <View style={styles.selectedLocationContainer}>
        <Image
          defaultSource={require('../assets/images/placeholder.jpg')}
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

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error message="A apărut o eroare la încărcarea locațiilor" />;
  }

  return (
    <View style={styles.container}>
      <MapScreen
        currentPosition={currentPosition}
        filteredLocations={filteredLocations}
        setSelectedLocation={setSelectedLocation}
        bottomSheetRef={bottomSheetRef}
        selectedLocation={selectedLocation}
      />
      <View style={styles.searchContainer}>
        <SearchBar
          onChangeText={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Caută după nume"
        />
        {/* <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Deschise acum</Text>
          <Switch
            value={showOpenNow}
            onValueChange={setShowOpenNow}
            thumbColor={
              showOpenNow ? theme.colors.primary : theme.colors.border
            }
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View> */}
      </View>
      {!isKeyboardVisible && (
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetView style={styles.contentContainer}>
            {selectedLocation ? (
              renderSelectedLocation(selectedLocation)
            ) : (
              <FlatList
                contentContainerStyle={styles.listContainer}
                data={filteredLocations}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderLocation}
              />
            )}
          </BottomSheetView>
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
    flex: 1,
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
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    gap: theme.spacing[2],
    padding: theme.spacing[2],
  },
  locationDistance: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  locationImage: {
    borderRadius: theme.borderRadius.md,
    width: theme.spacing[32],
  },
  locationInfo: {
    flex: 1,
  },
  locationInfoRow: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: theme.borderWidth.default,
    flexDirection: 'row',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[2],
  },
  locationName: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  locationSchedule: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    gap: theme.spacing[2],
    padding: theme.spacing[4],
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  selectedLocationAddress: {
    ...theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  selectedLocationContainer: {
    gap: theme.spacing[4],
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
  switchContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  switchLabel: {
    ...theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
