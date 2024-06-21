import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../components';
import { CustomAlert, Divider, Error, Loading } from '../components/UI';
import { RIPPLE_CONFIG } from '../constants';
import UserService from '../services/UserService';
import { AuthContext } from '../store/AuthContext';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function UserAccountScreen() {
  const [accountInfo, setAccountInfo] = useState([]);
  const [status, setStatus] = useState('loading');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});
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

  const showAlert = (
    title,
    message,
    confirmText,
    onConfirm,
    cancelText,
    onCancel
  ) => {
    setAlertProps({
      title,
      message,
      confirmText,
      onConfirm,
      cancelText,
      onCancel,
    });
    setAlertVisible(true);
  };

  const handleLogout = () => {
    showAlert(
      'Deconectare',
      'Ești sigur că vrei să te deconectezi?',
      'Deconectare',
      () => {
        setAlertVisible(false);
        auth.signOut();
      },
      'Anulare',
      () => setAlertVisible(false)
    );
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
      <View style={styles.accountDetailsContainer}>
        <View style={styles.avatarContainer}>
          <Avatar accountInfo={accountInfo} size="lg" />
          <Text style={styles.title}>
            {`${accountInfo.firstName} ${accountInfo.lastName}`}
          </Text>
        </View>
        <Pressable
          android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
          style={styles.button}
        >
          <View style={styles.row}>
            <Ionicons
              name="person-outline"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text style={styles.buttonText}>Informații personale</Text>
          </View>
        </Pressable>
        <Divider />
        <Pressable
          android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
          style={styles.button}
        >
          <View style={styles.row}>
            <Ionicons
              name="key-outline"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text style={styles.buttonText}>Schimbare parolă</Text>
          </View>
        </Pressable>
        <Divider />
        <Pressable
          android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
          style={styles.button}
        >
          <View style={styles.row}>
            <Ionicons
              name="settings-outline"
              color={theme.colors.textSecondary}
              size={24}
            />
            <Text style={styles.buttonText}>Setări cont</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.additionalOptionsContainer}>
        <Pressable
          android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
          onPress={handleLogout}
          style={styles.button}
        >
          <View style={styles.row}>
            <Ionicons
              name="log-out-outline"
              color={theme.colors.error}
              size={24}
            />
            <Text style={[styles.buttonText, styles.errorText]}>
              Deconectare
            </Text>
          </View>
        </Pressable>
        <Divider />
        <Pressable
          android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
          style={styles.button}
        >
          <View style={styles.row}>
            <Ionicons
              name="trash-outline"
              color={theme.colors.error}
              size={24}
            />
            <Text style={[styles.buttonText, styles.errorText]}>
              Ștergere cont
            </Text>
          </View>
        </Pressable>
      </View>
      <CustomAlert visible={alertVisible} {...alertProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingSmall,
    backgroundColor: theme.colors.backgroundSecondary,
    flex: 1,
  },
  accountDetailsContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  additionalOptionsContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    flex: 1,
    padding: theme.spacing[4],
    paddingTop: theme.spacing[2],
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    ...theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginTop: theme.spacing[2],
  },
  button: {
    marginHorizontal: -theme.spacing[4],
    padding: theme.spacing[4],
  },
  row: {
    ...global.spacingMedium,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    ...theme.fontSize.base,
    fontFamily: theme.fontFamily.body,
  },
  errorText: {
    color: theme.colors.error,
  },
});
