import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../styles/theme';

export default function SocialLinks({ links }) {
  if (!links) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Linkuri rețele de socializare</Text>
      <View>
        {Object.entries(links).map(([key, url]) => (
          <TouchableOpacity
            key={key}
            style={styles.linkContainer}
            onPress={() => Linking.openURL(url)}
          >
            <Text style={styles.link}>{key.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing['4'],
  },
  heading: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
  },
  linkContainer: {},
  link: {
    ...theme.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.body,
  },
});
