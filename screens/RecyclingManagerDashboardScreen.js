import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DashboardCard, MessageDistributionChart } from '../components';
import { Error, IconButton, Loading } from '../components/UI';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import RecyclingManagerService from '../services/RecyclingManagerService';
import { AuthContext } from '../store/AuthContext';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

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
      contentContainerStyle={styles.contentContainer}
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
      <MessageDistributionChart
        fadeAnim={fadeAnim}
        messageAggregation={stats?.messageAggregation}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  contentContainer: {
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
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
});
