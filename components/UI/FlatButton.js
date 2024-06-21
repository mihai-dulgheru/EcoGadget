import { Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function FlatButton({ extraStyles, onPress, title }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        extraStyles?.button,
        pressed && global.pressed,
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
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  buttonText: {
    ...theme.fontSize.base,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.heading,
    textAlign: 'center',
  },
});
