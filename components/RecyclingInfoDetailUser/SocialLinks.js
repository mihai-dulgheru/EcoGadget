import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
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
          <Pressable
            key={key}
            onPress={() => Linking.openURL(url)}
            style={({ pressed }) => [
              styles.linkContainer,
              pressed && global.pressed,
            ]}
          >
            <Text style={styles.link}>{key.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingMedium,
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
