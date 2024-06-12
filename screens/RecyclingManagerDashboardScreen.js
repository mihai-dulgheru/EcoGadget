import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Error, IconButton, Loading } from '../components/UI';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
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
  const AxiosAuth = useAxiosAuth();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  const fetchStatistics = useCallback(async () => {
    const statistics = await RecyclingManagerService.getStatistics(AxiosAuth);
    return statistics;
  }, [AxiosAuth]);

  const {
    data: stats,
    error,
    isPending,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['statistics'],
    queryFn: fetchStatistics,
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (isSuccess) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isSuccess]);

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
        />
      }
    >
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
        count={stats?.recyclingLocationCount}
        onPress={() => navigation.navigate('RecyclingLocationList')}
        fadeAnim={fadeAnim}
      />
      <DashboardCard
        icon="chatbox-ellipses"
        title="Mesaje utilizatori"
        count={stats?.messageCount}
        onPress={() => navigation.navigate('MessageList')}
        fadeAnim={fadeAnim}
      />
    </ScrollView>
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
