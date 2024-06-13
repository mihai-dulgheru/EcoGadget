import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Error, Loading } from '../components/UI';
import ApplianceService from '../services/ApplianceService';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function ApplianceStatisticsScreen() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('loading');
  const [statistics, setStatistics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const AxiosAuth = useAxiosAuth();

  const fetchLocation = useCallback(async () => {
    try {
      setStatus('loading');
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      if (permissionResponse?.status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch (error) {
      console.error('Error fetching location:', error);
      setStatus('error');
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      if (location) {
        const data = await ApplianceService.getRecommendations(
          AxiosAuth,
          location
        );
        setStatistics(data.statistics);
        setRecommendations(data.recommendations);
        setStatus('success');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setStatus('error');
    }
  }, [location, AxiosAuth]);

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [location]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Error message="A apărut o eroare la încărcarea recomandărilor și statisticilor" />
        <Button title="Reîncearcă" onPress={fetchLocation} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Statistici</Text>
      <Text style={styles.subheading}>
        Impact energetic și de mediu al electrocasnicelor:
      </Text>
      <View style={styles.statisticsContainer}>
        <View style={styles.card}>
          <Text style={styles.statisticsLabel}>Consum total de energie:</Text>
          <Text style={styles.statisticsValue}>
            {`${statistics.totalEnergyUsage} kWh/an`}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.statisticsLabel}>Emisii totale de CO2:</Text>
          <Text style={styles.statisticsValue}>
            {`${statistics.totalCO2Emissions} kg/an`}
          </Text>
        </View>
      </View>
      <Text style={styles.heading}>
        Recomandări de îmbunătățire a eficienței energetice
      </Text>
      {recommendations.length === 0 ? (
        <Text style={styles.text}>Nu există recomandări disponibile.</Text>
      ) : (
        recommendations.map((recommendation) => (
          <View key={recommendation} style={styles.card}>
            <Text style={styles.text}>{recommendation}</Text>
          </View>
        ))
      )}
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
  statisticsContainer: {
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
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
});
