import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { Avatar } from '../components';
import { CustomAlert, Divider, Error, Loading } from '../components/UI';
import { RIPPLE_CONFIG } from '../constants';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../hooks/useRefreshOnFocus';
import UserService from '../services/UserService';
import { AuthContext } from '../store/AuthContext';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

export default function UserAccountScreen() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const auth = useContext(AuthContext);
  const AxiosAuth = useAxiosAuth();

  const fetchAccountInfo = useCallback(async () => {
    const accountInfo = await UserService.getAccountInfo(AxiosAuth);
    return accountInfo;
  }, [AxiosAuth]);

  const {
    data: accountInfo,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['statistics'],
    queryFn: fetchAccountInfo,
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const deleteAccount = useCallback(async () => {
    await UserService.deleteAccount(AxiosAuth);
  }, [AxiosAuth]);

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      showAlert('Succes', 'Contul a fost șters cu succes', 'OK', () => {
        setAlertVisible(false);
        auth.signOut();
      });
    },
    onError: (mutationError) => {
      showAlert(
        'Eroare',
        mutationError.message || 'A apărut o eroare',
        'OK',
        () => setAlertVisible(false)
      );
    },
  });

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

  const handleDeleteAccount = () => {
    showAlert(
      'Ștergere cont',
      'Ești sigur că vrei să ștergi contul? Această acțiune este ireversibilă.',
      'Ștergere cont',
      async () => {
        setAlertVisible(false);
        await mutation.mutateAsync();
      },
      'Anulare',
      () => setAlertVisible(false)
    );
  };

  if (isPending || mutation.isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
        />
      }
    >
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
          disabled={mutation.isPending}
          onPress={handleDeleteAccount}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
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
