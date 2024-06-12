import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function Button({
  color = 'primary',
  disabled,
  onPress,
  title,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[color],
        pressed && styles.pressed,
      ]}
    >
      <View>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
    width: '100%',
    // elevation: 2,
    // shadowColor: 'black',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    ...theme.fontSize.base,
    color: 'white',
    fontFamily: theme.fontFamily.heading,
    textAlign: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  error: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
});
