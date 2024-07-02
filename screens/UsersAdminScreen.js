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

export default function UsersAdminScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  const queryClient = useQueryClient();
  const {
    data: users,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => AdminService.getUsers(AxiosAuth),
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => AdminService.deleteUser(AxiosAuth, userId),
    onSuccess: async () => queryClient.invalidateQueries(['users']),
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
    (user) => navigation.navigate('EditUserAdmin', { user }),
    [navigation]
  );

  const handleDelete = useCallback(
    (userId) => {
      showAlert(
        setAlertProps,
        setAlertVisible,
        'Confirmare ștergere',
        'Ești sigur că vrei să ștergi acest utilizator?',
        'Șterge',
        async () => {
          setAlertVisible(false);
          await deleteUserMutation.mutateAsync(userId);
        },
        'Anulează',
        () => setAlertVisible(false)
      );
    },
    [deleteUserMutation]
  );

  if (isPending || deleteUserMutation.isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => handleEdit(item)}
      style={({ pressed }) => [styles.userItem, pressed && global.pressed]}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
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
        data={users}
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
  userItem: {
    ...global.spacingSmall,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
    padding: theme.spacing[4],
  },
  userName: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  userEmail: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  deleteButton: {
    padding: theme.spacing[4],
  },
});
