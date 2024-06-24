import { StyleSheet, Text, View } from 'react-native';
import { WEEKDAY_TRANSLATIONS } from '../../constants';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function RecyclingScheduleView({ schedule }) {
  return (
    <View>
      {Object.entries(schedule)
        .filter(([, scheduleItem]) => scheduleItem !== 'Closed')
        .map(([day, scheduleItem]) => (
          <View key={day} style={styles.container}>
            <Text style={[styles.minWidth, styles.text]}>
              {`${WEEKDAY_TRANSLATIONS[day]}:`}
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
    ...global.spacingSmall,
    flexDirection: 'row',
  },
  minWidth: {
    minWidth: theme.spacing[16],
  },
  text: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
