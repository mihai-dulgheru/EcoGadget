import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import {
  FlatList,
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
import AdminService from '../services/AdminService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const showAlert = (
  setAlertProps,
  setAlertVisible,
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

export default function RecyclingManagersAdminScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const queryClient = useQueryClient();
  const {
    data: managers,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['recyclingManagers'],
    queryFn: async () => AdminService.getRecyclingManagers(AxiosAuth),
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const deleteManagerMutation = useMutation({
    mutationFn: async (managerId) =>
      AdminService.deleteRecyclingManager(AxiosAuth, managerId),
    onSuccess: async () => queryClient.invalidateQueries(['recyclingManagers']),
    onError: (mutationError) => {
      showAlert(
        setAlertProps,
        setAlertVisible,
        'Eroare',
        mutationError.message || 'A apărut o eroare',
        'OK',
        () => setAlertVisible(false)
      );
    },
  });

  const handleEdit = useCallback(
    (manager) => navigation.navigate('EditUserAdmin', { user: manager }),
    [navigation]
  );

  const handleDelete = useCallback(
    (managerId) => {
      showAlert(
        setAlertProps,
        setAlertVisible,
        'Confirmare ștergere',
        'Ești sigur că vrei să ștergi acest manager?',
        'Șterge',
        async () => {
          setAlertVisible(false);
          await deleteManagerMutation.mutateAsync(managerId);
        },
        'Anulează',
        () => setAlertVisible(false)
      );
    },
    [deleteManagerMutation]
  );

  if (isPending || deleteManagerMutation.isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => handleEdit(item)}
      style={({ pressed }) => [styles.managerItem, pressed && global.pressed]}
    >
      <View style={styles.managerInfo}>
        <Text style={styles.managerName}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
        <Text
          style={styles.managerEmail}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.email}
        </Text>
      </View>
      <IconButton
        color={theme.colors.error}
        extraStyles={{ button: styles.deleteButton }}
        icon="trash"
        onPress={() => handleDelete(item._id)}
        size={24}
      />
    </Pressable>
  );

  return (
    <>
      <FlatList
        contentContainerStyle={styles.container}
        data={managers}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingMedium,
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    padding: theme.spacing[4],
  },
  managerItem: {
    ...global.spacingSmall,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  managerInfo: {
    flex: 1,
    padding: theme.spacing[4],
  },
  managerName: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  managerEmail: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  deleteButton: {
    padding: theme.spacing[4],
  },
});
