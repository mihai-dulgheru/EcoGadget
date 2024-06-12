import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RecyclingScheduleView } from '../components/RecyclingLocationList';
import {
  Error,
  IconButton,
  ListEmptyComponent,
  Loading,
} from '../components/UI';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import RecyclingManagerService from '../services/RecyclingManagerService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function RecyclingLocationListScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const fetchLocations = useCallback(async () => {
    const locations =
      await RecyclingManagerService.getRecyclingLocations(AxiosAuth);
    return locations;
  }, [AxiosAuth]);

  const {
    data: locations,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const deleteLocation = useCallback(
    async (id) => {
      await RecyclingManagerService.deleteRecyclingLocation(AxiosAuth, id);
    },
    [AxiosAuth]
  );

  const mutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries(['locations']);
    },
  });

  const handleAddButtonPress = useCallback(() => {
    navigation.navigate('RecyclingLocationEdit', { location: {} });
  }, [navigation]);

  const handleEdit = useCallback(
    (location) => {
      navigation.navigate('RecyclingLocationEdit', { location });
    },
    [navigation]
  );

  const handleDelete = useCallback(
    (id) => {
      Alert.alert(
        'Confirmă ștergerea',
        'Ești sigur că vrei să ștergi această locație?',
        [
          { text: 'Anulează', style: 'cancel' },
          {
            text: 'Șterge',
            onPress: () => mutation.mutateAsync(id),
          },
        ]
      );
    },
    [mutation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableWithoutFeedback onPress={() => handleEdit(item)}>
        <View style={styles.locationItem}>
          <Image
            defaultSource={require('../assets/images/placeholder.jpg')}
            source={{ uri: item.image }}
            style={styles.locationImage}
          />
          <Text style={styles.locationTitle}>{item.name}</Text>
          <RecyclingScheduleView schedule={item.schedule} />
          <View style={styles.addressContainer}>
            <Ionicons
              name="location"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text style={styles.addressText}>{item.address}</Text>
          </View>
          <View style={styles.locationDeleteButton}>
            <IconButton
              icon="trash"
              color={theme.colors.textSecondary}
              size={24}
              onPress={() => handleDelete(item._id)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    ),
    [handleDelete, handleEdit]
  );

  if (isPending || mutation.isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.addButton}>
        <IconButton
          color="white"
          icon="add"
          onPress={handleAddButtonPress}
          size={28}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={locations}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
          />
        }
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth.default,
    bottom: theme.spacing['4'],
    height: theme.spacing['14'],
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing['4'],
    width: theme.spacing['14'],
    zIndex: 1,
  },
  listContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    gap: theme.spacing['4'],
    padding: theme.spacing['4'],
  },
  locationItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing['2'],
    padding: theme.spacing['2'],
  },
  locationImage: {
    aspectRatio: 4 / 3,
    borderRadius: theme.borderRadius.md,
  },
  locationTitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  addressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing['1'],
  },
  addressText: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  locationDeleteButton: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.full,
    height: theme.spacing['10'],
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing['4'],
    top: theme.spacing['4'],
  },
});
