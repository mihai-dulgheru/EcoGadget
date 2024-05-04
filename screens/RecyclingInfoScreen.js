import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RecyclingInfoService from '../services/RecyclingInfoService';
import theme from '../styles/theme';

export default function RecyclingInfoScreen({ navigation }) {
  const [recyclingInfo, setRecyclingInfo] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchRecyclingInfo = async () => {
      try {
        const { data } = await RecyclingInfoService.getRecyclingInfo();
        setRecyclingInfo(data);
        setStatus('success');
      } catch (error) {
        console.error('Error loading recycling info:', error);
        setStatus('error');
      }
    };

    fetchRecyclingInfo();
  }, []);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error fetching locations</Text>
      </View>
    );
  }

  const renderRecyclingInfo = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('RecyclingInfoDetails', {
          recyclingInfo: item,
        });
      }}
    >
      <View key={`recycling-info-${item._id}`} style={styles.infoBlock}>
        <Image
          defaultSource={require('../assets/images/placeholder.jpg')}
          source={{ uri: item.picture.url }}
          style={styles.image}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={recyclingInfo}
      renderItem={renderRecyclingInfo}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: theme.colors.secondary,
  },
  listContainer: {
    flexGrow: 1,
    gap: theme.spacing['6'],
    padding: theme.spacing['6'],
  },
  infoBlock: {},
  image: {
    borderRadius: theme.borderRadius.md,
    height: theme.spacing['40'],
    marginBottom: theme.spacing['4'],
    width: '100%',
  },
  title: {
    ...theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing['2'],
  },
  subtitle: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
  },
});
