import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export default function Select({
  label,
  selectedValue,
  onValueChange,
  items,
  errorText,
  isInvalid,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={
          isInvalid
            ? [styles.pickerContainer, styles.invalid]
            : styles.pickerContainer
        }
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      {isInvalid && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing['2'],
  },
  label: {
    marginBottom: theme.spacing['2'],
    color: theme.colors.textPrimary,
    ...theme.fontSize.sm,
  },
  pickerContainer: {
    borderWidth: theme.borderWidth.default,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.default,
  },
  picker: {
    color: theme.colors.textPrimary,
  },
  invalid: {
    borderColor: theme.colors.error,
  },
  errorText: {
    marginTop: theme.spacing['1'],
    color: theme.colors.error,
    ...theme.fontSize.sm,
  },
});
