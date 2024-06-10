import Checkbox from 'expo-checkbox';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../styles/theme';

function ClosedCheckbox({ isClosed, setIsClosed, label }) {
  return (
    <View style={styles.row}>
      <Checkbox
        style={styles.checkbox}
        value={isClosed}
        onValueChange={setIsClosed}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: theme.spacing['2'],
  },
  labelContainer: {
    width: '100%',
  },
  label: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
  },
});
