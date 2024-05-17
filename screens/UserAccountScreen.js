import { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, Error, Loading } from '../components/UI';
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
    return <Loading />;
  }

  if (status === 'error') {
    return (
      <Error message="A apărut o eroare la încărcarea detaliilor utilizatorului" />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{}}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Nume</Text>
            <Text style={styles.value}>{accountInfo.lastName}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Prenume</Text>
            <Text style={styles.value}>{accountInfo.firstName}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{accountInfo.email}</Text>
          </View>
          <View style={[styles.infoBlock, styles.infoBlockLast]}>
            <Text style={styles.label}>Telefon</Text>
            <Text style={styles.value}>{accountInfo.phone}</Text>
          </View>
        </View>
        <Button color="error" onPress={handleLogout}>
          Deconectare
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
    padding: theme.spacing['4'],
  },
  content: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing['2'],
    padding: theme.spacing['2'],
  },
  infoBlock: {
    borderBottomColor: theme.colors.textSecondary,
    borderBottomWidth: theme.spacing.px,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing['2'],
    paddingBottom: theme.spacing['2'],
  },
  infoBlockLast: {
    borderBottomWidth: theme.spacing['0'],
  },
  label: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  value: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
  },
});
