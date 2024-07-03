import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CustomAlert,
  Error,
  IconButton,
  ListEmptyComponent,
  Loading,
} from '../components/UI';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import RecyclingInfoService from '../services/RecyclingInfoService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function RecyclingInfoListAdminScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const {
    data: infos,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['infos'],
    queryFn: async () => RecyclingInfoService.getRecyclingInfos(AxiosAuth),
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const mutation = useMutation({
    mutationFn: async (id) =>
      RecyclingInfoService.deleteRecyclingInfo(AxiosAuth, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['infos']);
    },
  });

  const showAlert = (
    title,
    message,
    confirmText,
    onConfirm,
    cancelText,
    onCancel
  ) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
      cancelText,
      onCancel,
    });
    setAlertVisible(true);
  };

  const handleAddButtonPress = useCallback(() => {
    navigation.navigate('RecyclingInfoEditAdmin', { info: {} });
  }, [navigation]);

  const handleEdit = useCallback(
    (info) => {
      navigation.navigate('RecyclingInfoEditAdmin', { info });
    },
    [navigation]
  );

  const handleDelete = useCallback(
    (id) => {
      showAlert(
        'Confirmă ștergerea',
        'Ești sigur că vrei să ștergi această informație?',
        'Șterge',
        () => {
          mutation.mutateAsync(id);
          setAlertVisible(false);
        },
        'Anulează',
        () => setAlertVisible(false)
      );
    },
    [mutation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <Pressable onPress={() => handleEdit(item)}>
        <View style={styles.infoItem}>
          <Image source={{ uri: item.picture }} style={styles.infoImage} />
          <Text style={styles.infoTitle}>{item.title}</Text>
          <Text style={styles.infoSubtitle}>{item.subtitle}</Text>
          <View style={styles.infoDeleteButton}>
            <IconButton
              icon="trash"
              color={theme.colors.textSecondary}
              size={24}
              onPress={() => handleDelete(item._id)}
            />
          </View>
        </View>
      </Pressable>
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
    <View style={global.flex1}>
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
        data={infos}
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
      <CustomAlert visible={alertVisible} {...alertProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth.default,
    bottom: theme.spacing[4],
    height: theme.spacing[14],
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing[4],
    width: theme.spacing[14],
    zIndex: 1,
  },
  listContainer: {
    ...global.spacingMedium,
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    padding: theme.spacing[4],
  },
  infoItem: {
    ...global.spacingSmall,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[2],
  },
  infoImage: {
    aspectRatio: 4 / 3,
    borderRadius: theme.borderRadius.md,
  },
  infoTitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  infoSubtitle: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  infoDeleteButton: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.full,
    height: theme.spacing[10],
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing[4],
    top: theme.spacing[4],
  },
});
