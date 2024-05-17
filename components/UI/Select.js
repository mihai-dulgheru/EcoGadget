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
    <View>
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
  label: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing['1'],
  },
  pickerContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    height: theme.spacing['12'],
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.textPrimary,
  },
  invalid: {
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing['1'],
  },
});
