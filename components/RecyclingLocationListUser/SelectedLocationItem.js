import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';
import { RecyclingScheduleView } from '../RecyclingLocationListManager';
import { Button } from '../UI';

export default function SelectedLocationItem({ item, onPress }) {
  return (
    <View style={styles.selectedLocationContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.selectedLocationImage}
      />
      <View>
        <Text style={styles.selectedLocationName}>{item.name}</Text>
        <View style={styles.locationInfoRow}>
          <Ionicons
            name="location-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.selectedLocationAddress}>{item.address}</Text>
        </View>
        <View style={styles.locationInfoRow}>
          <Ionicons
            name="navigate-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.selectedLocationDistance}>{item.distance}</Text>
        </View>
        <View style={styles.locationInfoRow}>
          <Ionicons
            name="time-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <RecyclingScheduleView schedule={item.schedule} />
        </View>
        <View style={[styles.locationInfoRow, { borderBottomWidth: 0 }]}>
          <Ionicons
            name="call-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.selectedLocationPhone}>{item.phone}</Text>
        </View>
      </View>
      <View>
        <Button onPress={onPress} title="Detalii" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedLocationContainer: {
    ...global.spacingMedium,
    padding: theme.spacing[2],
  },
  selectedLocationImage: {
    borderRadius: theme.borderRadius.md,
    height: 200,
    width: '100%',
  },
  selectedLocationName: {
    ...theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginBottom: theme.spacing[2],
  },
  locationInfoRow: {
    ...global.spacingSmall,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: theme.borderWidth.default,
    flexDirection: 'row',
    paddingVertical: theme.spacing[2],
  },
  selectedLocationAddress: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    flex: 1,
    fontFamily: theme.fontFamily.body,
  },
  selectedLocationDistance: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  selectedLocationPhone: {
    ...theme.fontSize.base,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
