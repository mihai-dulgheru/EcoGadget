import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Error, Loading } from '../components/UI';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import ApplianceService from '../services/ApplianceService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function ApplianceStatisticsScreen() {
  const AxiosAuth = useAxiosAuth();

  const { data, error, isPending, refetch } = useQuery({
    queryKey: ['applianceRecommendations'],
    queryFn: async () => {
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      if (permissionResponse?.status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      return ApplianceService.getRecommendations(AxiosAuth, location.coords);
    },
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const typeTranslationMap = {
    donation: 'donare',
    recycling: 'reciclare',
    swap: 'schimb',
  };

  const renderRecyclingDonationSwap = () => {
    const { recyclingDonationSwap } = data;

    if (!recyclingDonationSwap) {
      return null;
    }

    const { type, recommendation, recyclingCenter, appliance } =
      recyclingDonationSwap;

    return (
      <>
        <Text style={styles.heading}>
          Reciclare, donare și schimb de electrocasnice
        </Text>
        <Text style={styles.subheading}>
          <Text>Recomandare de </Text>
          <Text style={global.fontBold}>{typeTranslationMap[type]}</Text>
          <Text>: </Text>
          <Text>{recommendation}</Text>
        </Text>
        <Text style={styles.subheading}>
          <Text>Centru de reciclare: </Text>
          <Text style={global.fontBold}>{recyclingCenter.name}</Text>
        </Text>
        <Text style={styles.subheading}>
          <Text>Dispozitiv: </Text>
          <Text style={global.fontBold}>{appliance.name}</Text>
        </Text>
      </>
    );
  };

  const renderRecommendations = () => {
    const { recommendations, aiNotificationsEnabled } = data;

    if (!aiNotificationsEnabled) {
      return <Text style={styles.text}>Notificările AI sunt dezactivate.</Text>;
    }

    if (recommendations.length === 0) {
      return (
        <Text style={styles.text}>Nu există recomandări disponibile.</Text>
      );
    }

    return recommendations.map((recommendation) => (
      <View key={recommendation} style={styles.card}>
        <Text style={styles.text}>{recommendation}</Text>
      </View>
    ));
  };

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Error message={error.message} />
        <Button title="Reîncearcă" onPress={refetch} />
      </View>
    );
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
      <Text style={styles.heading}>Statistici</Text>
      <Text style={styles.subheading}>
        Impact energetic și de mediu al electrocasnicelor:
      </Text>
      <View style={styles.dataSection}>
        <View style={styles.card}>
          <Text style={styles.statisticsLabel}>Consum total de energie:</Text>
          <Text style={styles.statisticsValue}>
            {`${data.statistics.totalEnergyUsage} kWh/an`}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.statisticsLabel}>Emisii totale de CO2:</Text>
          <Text style={styles.statisticsValue}>
            {`${data.statistics.totalCO2Emissions} kg/an`}
          </Text>
        </View>
      </View>
      <View style={styles.dataSection}>
        <Text style={styles.heading}>
          Recomandări de îmbunătățire a eficienței energetice
        </Text>
        {renderRecommendations()}
      </View>
      {renderRecyclingDonationSwap()}
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
  heading: {
    ...theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginBottom: theme.spacing[2],
  },
  subheading: {
    ...theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[2],
  },
  text: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[2],
  },
  dataSection: {
    marginBottom: theme.spacing[4],
  },
  statisticsLabel: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  statisticsValue: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  card: {
    ...theme.shadow.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
    padding: theme.spacing[3],
  },
});
