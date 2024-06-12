import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function FlatButton({ extraStyles, onPress, title }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        extraStyles?.button,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonText, extraStyles?.buttonText]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    ...theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.heading,
    textAlign: 'center',
  },
});
