import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function FlatButton({ children, extraStyles, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonText, extraStyles?.buttonText]}>
          {children}
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
    textAlign: 'center',
  },
});
