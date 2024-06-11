import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function RecyclingScheduleView({ schedule }) {
  const weekdayTranslations = {
    monday: 'Luni',
    tuesday: 'Marți',
    wednesday: 'Miercuri',
    thursday: 'Joi',
    friday: 'Vineri',
    saturday: 'Sâmbătă',
    sunday: 'Duminică',
  };

  return (
    <View>
      {Object.entries(schedule)
        .filter(([, scheduleItem]) => scheduleItem !== 'Closed')
        .map(([day, scheduleItem]) => (
          <View key={day} style={styles.container}>
            <Text style={[styles.minWidth, styles.text]}>
              {`${weekdayTranslations[day]}:`}
            </Text>
            <Text style={styles.text}>
              {scheduleItem === 'Closed' ? 'Închis' : scheduleItem}
            </Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing['2'],
  },
  minWidth: {
    minWidth: theme.spacing['16'],
  },
  text: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
