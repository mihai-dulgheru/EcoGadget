import Checkbox from 'expo-checkbox';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../styles/theme';

function ClosedCheckbox({ isClosed, label, setIsClosed }) {
  return (
    <View style={styles.row}>
      <Checkbox
        onValueChange={setIsClosed}
        style={styles.checkbox}
        value={isClosed}
      />
      <TouchableOpacity
        onPress={() => setIsClosed(!isClosed)}
        style={styles.labelContainer}
      >
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
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
