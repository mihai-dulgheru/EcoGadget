import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

function FlatButton({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.primary,
    textAlign: 'center',
  },
});
