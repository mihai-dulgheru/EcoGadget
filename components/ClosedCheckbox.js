import Checkbox from 'expo-checkbox';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../styles/global';
import theme from '../styles/theme';

function ClosedCheckbox({ isClosed, label, setIsClosed }) {
  return (
    <View style={styles.row}>
      <Checkbox
        onValueChange={setIsClosed}
        style={styles.checkbox}
        value={isClosed}
      />
      <Pressable
        onPress={() => setIsClosed(!isClosed)}
        style={({ pressed }) => [
          styles.labelContainer,
          pressed && global.pressed,
        ]}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

export default memo(ClosedCheckbox);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkbox: {
    marginRight: theme.spacing[2],
  },
  labelContainer: {
    width: '100%',
  },
  label: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
