import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function LocationItem({ item, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.locationContainer}>
        <Image source={{ uri: item.image }} style={styles.locationImage} />
        <View style={global.flex1}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationAddress}>{item.address}</Text>
          <Text style={styles.locationDistance}>{item.distance}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    ...global.spacingSmall,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    padding: theme.spacing[2],
  },
  locationImage: {
    borderRadius: theme.borderRadius.md,
    objectFit: 'cover',
    width: theme.spacing[32],
  },
  locationName: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  locationAddress: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  locationDistance: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
});
