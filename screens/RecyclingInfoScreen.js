import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Error, Loading } from '../components/UI';
import RecyclingInfoService from '../services/RecyclingInfoService';
import theme from '../styles/theme';
import { formatDate } from '../utils/DateUtils';

export default function RecyclingInfoScreen({ navigation }) {
  const [recyclingInfo, setRecyclingInfo] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchRecyclingInfo = async () => {
      try {
        const data = await RecyclingInfoService.getRecyclingInfo();
        setRecyclingInfo(data);
        setStatus('success');
      } catch (error) {
        console.error('Error loading recycling info:', error);
        setStatus('error');
      }
    };

    fetchRecyclingInfo();
  }, []);

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
        <View style={styles.row}>
          <Ionicons
            name="calendar-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.text}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons
            name="location-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.text}>{item.location.name}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return (
      <Error message="A apărut o eroare la încărcarea informațiilor de reciclare" />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={recyclingInfo}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderRecyclingInfo}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    flexGrow: 1,
    gap: theme.spacing['4'],
    padding: theme.spacing['4'],
  },
  infoBlock: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['2'],
    gap: theme.spacing['2'],
  },
  image: {
    borderRadius: theme.borderRadius.md,
    height: theme.spacing['40'],
    width: '100%',
  },
  title: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  subtitle: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing['2'],
  },
  text: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
