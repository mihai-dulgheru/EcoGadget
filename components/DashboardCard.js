import Ionicons from '@expo/vector-icons/Ionicons';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../styles/global';
import theme from '../styles/theme';

export default function DashboardCard({
  icon,
  title,
  count,
  onPress,
  fadeAnim,
}) {
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.rowSpaceBetween,
          pressed && global.pressed,
        ]}
      >
        <View style={styles.statRowContainer}>
          <Ionicons name={icon} color={theme.colors.textPrimary} size={20} />
          <Text style={styles.stat}>{title}</Text>
        </View>
        <Text style={styles.stat}>{count}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    justifyContent: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statRowContainer: {
    ...global.spacingSmall,
    alignItems: 'center',
    flexDirection: 'row',
  },
  stat: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
