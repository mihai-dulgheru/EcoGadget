import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function Button({ children, color = 'primary', onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[color],
        pressed && styles.pressed,
      ]}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
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
    fontWeight: 'bold',
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
