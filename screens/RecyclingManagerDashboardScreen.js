import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Error, Loading } from '../components/UI';
import RecyclingManagerService from '../services/RecyclingManagerService';
import { AuthContext } from '../store/AuthContext';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function RecyclingManagerDashboardScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [stats, setStats] = useState({
    recyclingLocationCount: 0,
    messageCount: 0,
    latestRecyclingLocations: [],
    latestMessages: [],
  });
  const [status, setStatus] = useState('loading');
  const AxiosAuth = useAxiosAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('loading');
        const statistics =
          await RecyclingManagerService.getStatistics(AxiosAuth);
        setStats(statistics);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching statistics', error);
        setStatus('error');
        await auth.signOut();
      }
    };

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
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.stat}>
        Locații de reciclare:
        {stats.recyclingLocationCount}
      </Text>
      <Text style={styles.stat}>
        Mesaje utilizatori:
        {stats.messageCount}
      </Text>
      <View>
        <Text style={styles.title}>Ultimele locații de reciclare</Text>
        {stats.latestRecyclingLocations.map((location) => (
          <Text key={location._id}>{location.name}</Text>
        ))}
      </View>
      <View>
        <Text style={styles.title}>Ultimele mesaje utilizatori</Text>
        {stats.latestMessages.map((message) => (
          <Text key={message._id}>{message.message}</Text>
        ))}
      </View>
      <View style={styles.actions}>
        <Button
          title="Lista locațiilor de reciclare"
          onPress={() => navigation.navigate('RecyclingLocationList')}
        />
        <Button
          title="Lista mesajelor utilizatorilor"
          onPress={() => navigation.navigate('MessageList')}
        />
        <Button title="Deconectare" onPress={auth.signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
    padding: theme.spacing[4],
  },
  title: {
    ...theme.fontSize['2xl'],
    fontWeight: 'bold',
    marginBottom: theme.spacing[4],
  },
  stat: {
    ...theme.fontSize.lg,
    marginBottom: theme.spacing[2],
  },
  actions: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
});
