import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { CustomAlert, Error, Loading } from '../components/UI';
import { RIPPLE_CONFIG } from '../constants';
import UserService from '../services/UserService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const showAlert = (
  setAlertProps,
  setAlertVisible,
  title,
  message,
  confirmText,
  onConfirm
) => {
  setAlertProps({
    title,
    message,
    confirmText,
    onConfirm,
  });
  setAlertVisible(true);
};

const handleMutationError = (
  setAlertProps,
  setAlertVisible,
  error,
  setTempValue,
  originalValue
) => {
  setTempValue(originalValue); // Reset switch value on error
  showAlert(
    setAlertProps,
    setAlertVisible,
    'Eroare',
    error.message || 'A apărut o eroare',
    'OK',
    () => setAlertVisible(false)
  );
};

export default function UserAccountSettingsScreen() {
  const AxiosAuth = useAxiosAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const [tempValue, setTempValue] = useState(null);

  const {
    data: aiSettings,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      const data = await UserService.getAISettings(AxiosAuth);
      setTempValue(data.notificationsEnabled);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSettings) =>
      UserService.updateAISettings(AxiosAuth, newSettings),
    onSuccess: () => refetch(),
    onError: (mutationError) =>
      handleMutationError(
        setAlertProps,
        setAlertVisible,
        mutationError,
        setTempValue,
        aiSettings.notificationsEnabled
      ),
  });

  const toggleSwitch = useCallback(() => {
    const newValue = !tempValue;
    setTempValue(newValue);
    mutation.mutate({ notificationsEnabled: newValue });
  }, [tempValue, mutation]);

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.switchContainerWrapper}>
        <Pressable
          android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
          disabled={mutation.isPending}
          onPress={toggleSwitch}
          style={[styles.button, mutation.isPending && styles.disabledButton]}
        >
          <View style={styles.settingsRow}>
            <Text style={styles.label}>
              Recomandări de îmbunătățire a eficienței energetice
            </Text>
            <View style={styles.switchContainer}>
              <View style={styles.dividerVertical} />
              <Switch
                trackColor={{
                  false: theme.colors.textSecondary,
                  true: theme.colors.primary,
                }}
                thumbColor={
                  tempValue
                    ? theme.colors.textPrimary
                    : theme.colors.textSecondary
                }
                ios_backgroundColor={theme.colors.textSecondary}
                onValueChange={toggleSwitch}
                value={tempValue}
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                disabled={mutation.isPending}
              />
            </View>
          </View>
        </Pressable>
      </View>
      <CustomAlert visible={alertVisible} {...alertProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
    paddingVertical: theme.spacing[4],
  },
  switchContainerWrapper: {
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
  },
  disabledButton: {
    backgroundColor: theme.colors.backgroundDisabled,
  },
  settingsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
  },
  label: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    lineHeight: theme.spacing[6],
  },
  switchContainer: {
    ...global.spacingSmall,
    alignItems: 'center',
    flexDirection: 'row',
  },
  dividerVertical: {
    backgroundColor: theme.colors.border,
    height: theme.spacing[6],
    width: theme.borderWidth.default,
  },
});
