import { StyleSheet, Text, View } from 'react-native';
import global from '../styles/global';
import theme from '../styles/theme';

export default function UserAccountChangePhoneNumberScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Schimbare număr de telefon</Text>
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
});
