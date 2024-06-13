import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
      <TouchableOpacity style={styles.rowSpaceBetween} onPress={onPress}>
        <View style={styles.statRowContainer}>
          <Ionicons name={icon} color={theme.colors.textPrimary} size={20} />
          <Text style={styles.stat}>{title}</Text>
        </View>
        <Text style={styles.stat}>{count}</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  stat: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
