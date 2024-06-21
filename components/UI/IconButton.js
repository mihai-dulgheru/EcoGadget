import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function IconButton({
  color,
  extraStyles,
  icon,
  onPress,
  size,
  ...props
}) {
  const getButtonStyle = (pressed) => {
    const baseStyles = [styles.button, extraStyles?.button];
    const pressedStyles = pressed ? [global.pressed, extraStyles?.pressed] : [];
    return Object.assign({}, ...baseStyles, ...pressedStyles);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => getButtonStyle(pressed)}
      {...props}
    >
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius['3xl'],
    margin: theme.spacing[2],
    opacity: theme.opacity.default,
  },
});
