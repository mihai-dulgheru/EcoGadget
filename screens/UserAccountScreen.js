import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/UI';
import UserService from '../services/UserService';
import { AuthContext } from '../store/AuthContext';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function UserAccountScreen() {
  const [accountInfo, setAccountInfo] = useState([]);
  const [status, setStatus] = useState('loading');
  const auth = useContext(AuthContext);
  const AxiosAuth = useAxiosAuth();

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const data = await UserService.getAccountInfo(AxiosAuth);
        setAccountInfo(data);
        setStatus('success');
      } catch (error) {
        console.error('Error fetching account info:', error);
        setStatus('error');
        await auth.signOut();
      }
    };

    fetchAccountInfo();
  }, []);

  const handleLogout = () => {
    Alert.alert('Deconectare', 'Sunteți sigur că doriți să vă deconectați?', [
      {
        text: 'Anulare',
        style: 'cancel',
      },
      {
        text: 'Deconectare',
        onPress: auth.signOut,
      },
    ]);
  };

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
        <Text style={styles.error}>
          A apărut o eroare la încărcarea detaliilor utilizatorului
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.value}>{accountInfo.email}</Text>
      </View>
      <Button onPress={handleLogout}>Deconectare</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing['4'],
  },
  details: {
    marginBottom: theme.spacing['4'],
  },
  label: {
    ...theme.fontSize.base,
    fontWeight: 'bold',
    marginBottom: theme.spacing['1'],
  },
  value: {
    ...theme.fontSize.base,
    marginBottom: theme.spacing['4'],
  },
});
