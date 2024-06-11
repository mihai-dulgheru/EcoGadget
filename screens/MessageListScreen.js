import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
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
import RecyclingManagerService from '../services/RecyclingManagerService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function MessageListScreen({ navigation, route }) {
  const { dataUpdatedAt } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('loading');
  const AxiosAuth = useAxiosAuth();

  const fetchMessages = useCallback(async () => {
    try {
      setStatus('loading');
      const data = await RecyclingManagerService.getMessages(AxiosAuth);
      setMessages(data);
      setStatus('success');
    } catch (error) {
      console.error('Error loading messages:', error);
      setStatus('error');
    }
  }, [AxiosAuth]);

  useEffect(() => {
    fetchMessages();
  }, [dataUpdatedAt]);

  const handleViewDetails = async (message) => {
    if (!message.read) {
      try {
        await RecyclingManagerService.markMessageAsRead(AxiosAuth, message._id);
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg._id === message._id) {
              return { ...msg, read: true };
            }
            return msg;
          })
        );
      } catch (error) {
        console.error('Error marking message as read:', error);
        setStatus('error');
        return;
      }
    }
    navigation.navigate('MessageDetail', { message });
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error message="A apărut o eroare la încărcarea mesajelor" />;
  }

  const renderMessageItem = ({ item }) => (
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
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={ListEmptyComponent}
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
