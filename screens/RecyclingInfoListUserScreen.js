import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Error, ListEmptyComponent, Loading } from '../components/UI';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import RecyclingInfoService from '../services/RecyclingInfoService';
import global from '../styles/global';
import theme from '../styles/theme';
import { formatDate } from '../utils/DateUtils';

export default function RecyclingInfoListUserScreen({ navigation }) {
  const {
    data: recyclingInfo,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['recyclingInfo'],
    queryFn: async () => RecyclingInfoService.getRecyclingInfo(),
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const renderRecyclingInfo = ({ item }) => {
    const source = item.picture?.url
      ? { uri: item.picture?.url }
      : require('../assets/images/placeholder.jpg');

    return (
      <Pressable
        onPress={() => {
          navigation.navigate('RecyclingInfoDetailUser', {
            recyclingInfo: item,
          });
        }}
      >
        <View key={`recycling-info-${item._id}`} style={styles.infoBlock}>
          <Image source={source} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.secondaryText}>{item.subtitle}</Text>
          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.secondaryText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={24}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.secondaryText}>{item.location.name}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={recyclingInfo}
      keyExtractor={(item) => item._id.toString()}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
        />
      }
      renderItem={renderRecyclingInfo}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    ...global.spacingMedium,
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    padding: theme.spacing[4],
  },
  infoBlock: {
    ...global.spacingSmall,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[2],
  },
  image: {
    borderRadius: theme.borderRadius.md,
    height: theme.spacing[40],
    width: '100%',
  },
  title: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  secondaryText: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  row: {
    ...global.spacingSmall,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
