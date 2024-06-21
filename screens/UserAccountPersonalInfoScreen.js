import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Divider, Error, Loading } from '../components/UI';
import { RIPPLE_CONFIG } from '../constants';
import UserService from '../services/UserService';
import global from '../styles/global';
import theme from '../styles/theme';
import { useAxiosAuth } from '../utils/Axios';

const maskText = (text, isMasked) => {
  if (isMasked) {
    return text.replace(
      /^(.{3})(.*)(@.*)$/,
      (_, a, b, c) => a + b.replace(/./g, '*') + c
    );
  }
  return text;
};

const renderInfoItem = (iconName, text, onPress, isMasked) => (
  <Pressable
    android_ripple={{ ...RIPPLE_CONFIG, radius: theme.spacing[48] }}
    onPress={onPress}
    style={styles.button}
  >
    <View style={styles.row}>
      <Ionicons name={iconName} color={theme.colors.textSecondary} size={24} />
      <Text style={styles.buttonText}>{maskText(text, isMasked)}</Text>
    </View>
    <Text style={[styles.editText, isMasked && styles.secondaryTextColor]}>
      Editare
    </Text>
  </Pressable>
);

export default function UserAccountPersonalInfoScreen({ navigation }) {
  const AxiosAuth = useAxiosAuth();

  const fetchPersonalInfo = useCallback(
    async () => UserService.getPersonalInfo(AxiosAuth),
    [AxiosAuth]
  );

  const {
    data: personalInfo,
    error,
    isPending,
  } = useQuery({
    queryKey: ['personalInfo'],
    queryFn: fetchPersonalInfo,
  });

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Informații personale</Text>
      <View>
        {renderInfoItem(
          'person-outline',
          `${personalInfo.firstName} ${personalInfo.lastName}`,
          () => navigation.navigate('UserAccountUpdateName', { personalInfo })
        )}
        <Divider />
        {renderInfoItem('call-outline', personalInfo.phone, () =>
          navigation.navigate('UserAccountChangePhoneNumber', { personalInfo })
        )}
        <Divider />
        {renderInfoItem('mail-outline', personalInfo.email, null, true)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingLarge,
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
    padding: theme.spacing[4],
  },
  heading: {
    ...theme.fontSize['2xl'],
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  button: {
    ...global.spacingMedium,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  editText: {
    ...theme.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.body,
  },
  secondaryTextColor: {
    color: theme.colors.textSecondary,
  },
});
