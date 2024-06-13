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
      <Text style={[styles.label, isInvalid && styles.errorText]}>{label}</Text>
      <View style={[styles.pickerContainer, isInvalid && styles.invalid]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
              style={styles.pickerItem}
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
    fontFamily: theme.fontFamily.body,
    marginBottom: theme.spacing[1],
  },
  pickerContainer: {
    backgroundColor: theme.colors.backgroundPrimary,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.default,
    height: theme.spacing[12],
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.textPrimary,
  },
  pickerItem: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  invalid: {
    borderColor: theme.colors.error,
    marginBottom: theme.spacing[1],
  },
  errorText: {
    ...theme.fontSize.sm,
    color: theme.colors.error,
    fontFamily: theme.fontFamily.body,
  },
});
