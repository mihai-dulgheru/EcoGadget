import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/UI';
import { AuthContext } from '../store/AuthContext';

export default function RecyclingManagerDashboardScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [stats, setStats] = useState({
    recyclingLocationCount: 0,
    messageCount: 0,
  });

  useEffect(() => {
    // Fetch statistics for recycling locations and messages
    // This is a placeholder, replace with actual data fetching
    const fetchData = async () => {
      const recyclingLocationCount = 10; // Fetch from API
      const messageCount = 5; // Fetch from API
      setStats({ recyclingLocationCount, messageCount });
    };

    fetchData();
  }, []);

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
      <Button onPress={() => navigation.navigate('RecyclingLocationList')}>
        Lista locațiilor de reciclare
      </Button>
      <Button onPress={() => navigation.navigate('MessageList')}>
        Lista mesajelor utilizatorilor
      </Button>
      <Button onPress={auth.signOut}>Deconectare</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stat: {
    fontSize: 18,
    marginBottom: 10,
  },
});
