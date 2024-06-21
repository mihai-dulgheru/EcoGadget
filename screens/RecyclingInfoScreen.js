import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Error, Loading } from '../components/UI';
import RecyclingInfoService from '../services/RecyclingInfoService';
import global from '../styles/global';
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
    <Pressable
      onPress={() => {
        navigation.navigate('RecyclingInfoDetails', {
          recyclingInfo: item,
        });
      }}
    >
      <View key={`recycling-info-${item._id}`} style={styles.infoBlock}>
        <Image source={{ uri: item.picture.url }} style={styles.image} />
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
    </Pressable>
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
  subtitle: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  row: {
    ...global.spacingSmall,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
