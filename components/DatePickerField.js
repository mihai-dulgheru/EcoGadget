import DateTimePicker from '@react-native-community/datetimepicker';
import { useField } from 'formik';
import { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../styles/global';
import theme from '../styles/theme';
import { formatDate } from '../utils/DateUtils';

export default function DatePickerField({ label, name }) {
  const [field, , helpers] = useField(name);
  const [state, setState] = useState({
    isPickerVisible: false,
    date: new Date(field.value),
  });

  const handleConfirm = useCallback(
    async (event, selectedDate) => {
      if (event.type === 'dismissed') {
        setState((prevState) => ({
          ...prevState,
          isPickerVisible: false,
        }));
        return;
      }
      const currentDate = selectedDate || state.date;
      setState((prevState) => ({
        ...prevState,
        date: currentDate,
        isPickerVisible: false,
      }));
      await helpers.setValue(currentDate);
    },
    [helpers, state]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() =>
          setState((prevState) => ({
            ...prevState,
            isPickerVisible: true,
          }))
        }
        style={({ pressed }) => [styles.button, pressed && global.pressed]}
      >
        <Text style={styles.buttonText}>{formatDate(state.date)}</Text>
      </Pressable>
      {state.isPickerVisible && (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          mode="date"
          value={state.date}
          onChange={handleConfirm}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...global.spacingSmall,
  },
  label: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[2],
  },
  buttonText: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
