import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../store/AuthContext';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function Header({ canGoBack, showSignOutButton, title }) {
  const auth = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        canGoBack && styles.paddingLeft,
        showSignOutButton && styles.paddingRight,
      ]}
    >
      <View style={styles.headerContainer}>
        {canGoBack && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && global.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.textPrimary}
            />
          </Pressable>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {showSignOutButton && (
        <Pressable
          onPress={auth.signOut}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && global.pressed,
          ]}
        >
          <Ionicons name="log-out" size={24} color={theme.colors.textPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingSmall,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
  },
  paddingLeft: {
    paddingLeft: theme.spacing[1.5],
  },
  paddingRight: {
    paddingRight: theme.spacing[1.5],
  },
  headerContainer: {
    ...global.spacingSmall,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    padding: theme.spacing[2],
  },
  title: {
    ...theme.fontSize['2xl'],
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    paddingVertical: theme.spacing[2],
  },
  signOutButton: {
    padding: theme.spacing[2],
  },
});
