import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Error, IconButton, Loading } from '../components/UI';
import RecyclingManagerService from '../services/RecyclingManagerService';
import { AuthContext } from '../store/AuthContext';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

function DashboardCard({ icon, title, count, onPress, fadeAnim }) {
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.rowSpaceBetween} onPress={onPress}>
        <View style={styles.statRowContainer}>
          <Ionicons name={icon} color={theme.colors.textPrimary} size={20} />
          <Text style={styles.stat}>{title}</Text>
        </View>
        <Text style={styles.stat}>{count}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function RecyclingManagerDashboardScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [stats, setStats] = useState({
    recyclingLocationCount: 0,
    messageCount: 0,
  });
  const [status, setStatus] = useState('loading');
  const AxiosAuth = useAxiosAuth();

  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchData = useCallback(async () => {
    try {
      setStatus('loading');
      const statistics = await RecyclingManagerService.getStatistics(AxiosAuth);
      setStats(statistics);
      setStatus('success');

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching statistics', error);
      setStatus('error');
      await auth.signOut();
    }
  }, [AxiosAuth, auth, fadeAnim]);

  useEffect(() => {
    fetchData();
  }, []);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <Error message="A apărut o eroare la încărcarea datelor" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <IconButton
          icon="log-out"
          color={theme.colors.textPrimary}
          size={24}
          onPress={auth.signOut}
        />
      </View>
      <DashboardCard
        icon="trash-bin"
        title="Locații de reciclare"
        count={stats.recyclingLocationCount}
        onPress={() => navigation.navigate('RecyclingLocationList')}
        fadeAnim={fadeAnim}
      />
      <DashboardCard
        icon="chatbox-ellipses"
        title="Mesaje utilizatori"
        count={stats.messageCount}
        onPress={() => navigation.navigate('MessageList')}
        fadeAnim={fadeAnim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
    padding: theme.spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    ...theme.fontSize['2xl'],
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    justifyContent: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  stat: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
  },
});
