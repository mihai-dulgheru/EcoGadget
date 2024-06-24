import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

const showAlert = (
  setAlertProps,
  setAlertVisible,
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

const renderInfoItem = (iconName, text, onPress, isError) => (
  <Pressable
    android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
    onPress={onPress}
    style={styles.button}
  >
    <View style={styles.row}>
      <Ionicons
        name={iconName}
        color={isError ? theme.colors.error : theme.colors.textSecondary}
        size={24}
      />
      <Text style={[styles.buttonText, isError && styles.errorText]}>
        {text}
      </Text>
    </View>
  </Pressable>
);

export default function UserAccountScreen({ navigation }) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const auth = useContext(AuthContext);
  const AxiosAuth = useAxiosAuth();

  const {
    data: accountInfo,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['accountInfo'],
    queryFn: async () => UserService.getAccountInfo(AxiosAuth),
  });

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const mutation = useMutation({
    mutationFn: async () => UserService.deleteAccount(AxiosAuth),
    onSuccess: () => {
      showAlert(
        setAlertProps,
        setAlertVisible,
        'Succes',
        'Contul a fost șters cu succes',
        'OK',
        () => {
          setAlertVisible(false);
          auth.signOut();
        }
      );
    },
    onError: (mutationError) => {
      showAlert(
        setAlertProps,
        setAlertVisible,
        'Eroare',
        mutationError.message || 'A apărut o eroare',
        'OK',
        () => setAlertVisible(false)
      );
    },
  });

  const handleLogout = () => {
    showAlert(
      setAlertProps,
      setAlertVisible,
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
      setAlertProps,
      setAlertVisible,
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
        {renderInfoItem('person-outline', 'Informații personale', () =>
          navigation.navigate('UserAccountPersonalInfo')
        )}
        <Divider />
        {renderInfoItem('key-outline', 'Schimbare parolă', () =>
          navigation.navigate('UserAccountChangePassword')
        )}
        <Divider />
        {renderInfoItem('settings-outline', 'Setări cont', () =>
          navigation.navigate('UserAccountSettings')
        )}
      </View>
      <View style={styles.additionalOptionsContainer}>
        {renderInfoItem('log-out-outline', 'Deconectare', handleLogout, true)}
        <Divider />
        {renderInfoItem(
          'trash-outline',
          'Ștergere cont',
          handleDeleteAccount,
          true
        )}
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
