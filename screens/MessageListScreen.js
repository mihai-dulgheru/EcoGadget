import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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

export default function MessageListScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const fetchMessages = useCallback(async () => {
    const messages = await RecyclingManagerService.getMessages(AxiosAuth);
    return messages;
  }, [AxiosAuth]);

  const {
    data: messages,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 1000 * 60 * 5,
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const markAsReadMutation = useMutation({
    mutationFn: (id) =>
      RecyclingManagerService.markMessageAsRead(AxiosAuth, id),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  const handleViewDetails = useCallback(
    async (message) => {
      if (!message.read) {
        markAsReadMutation.mutate(message._id);
      }
      navigation.navigate('MessageDetail', { message });
    },
    [markAsReadMutation, navigation]
  );

  const renderMessageItem = useCallback(
    ({ item }) => (
      <TouchableWithoutFeedback onPress={() => handleViewDetails(item)}>
        <View style={[styles.messageItem, !item.read && styles.unreadMessage]}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageEmail}>{item.email}</Text>
          <Text style={styles.messageText} numberOfLines={3}>
            {item.message}
          </Text>
          <View style={styles.messageDetailButton}>
            <IconButton
              icon="arrow-forward"
              color={theme.colors.textSecondary}
              size={24}
              onPress={() => handleViewDetails(item)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    ),
    [handleViewDetails]
  );

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
          />
        }
        renderItem={renderMessageItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  listContainer: {
    flexGrow: 1,
    padding: theme.spacing['4'],
    gap: theme.spacing['4'],
  },
  messageItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['4'],
    gap: theme.spacing['2'],
    position: 'relative',
    opacity: 0.7,
  },
  unreadMessage: {
    borderColor: theme.colors.border,
    borderWidth: theme.borderWidth[2],
    opacity: 1,
  },
  messageName: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  messageEmail: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  messageText: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
  },
  messageDetailButton: {
    position: 'absolute',
    top: theme.spacing['2'],
    right: theme.spacing['2'],
  },
});
