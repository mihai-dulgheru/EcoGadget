import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

function Button({ children, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
});
