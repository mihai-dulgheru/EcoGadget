import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function SearchResultItem({ item, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.searchResultContainer}>
        <View style={styles.distanceColumn}>
          <View style={styles.locationIconContainer}>
            <Ionicons
              name="location-outline"
              size={22}
              color={theme.colors.textPrimary}
            />
          </View>
          <Text style={styles.locationDistance}>{item.distance}</Text>
        </View>
        <View style={global.flex1}>
          <Text style={[styles.locationNameText]}>{item.name}</Text>
          <Text style={styles.locationAddress}>{item.address}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchResultContainer: {
    ...global.spacingMedium,
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    flex: 1,
    flexDirection: 'row',
  },
  distanceColumn: {
    alignItems: 'center',
    width: theme.spacing[14],
  },
  locationIconContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    padding: theme.spacing[2],
  },
  locationDistance: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  locationNameText: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  locationAddress: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
