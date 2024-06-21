import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function Header({ title, canGoBack }) {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, canGoBack && styles.containerWithBack]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundPrimary,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
  },
  containerWithBack: {
    ...global.spacingSmall,
    paddingLeft: theme.spacing[1.5],
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
});
