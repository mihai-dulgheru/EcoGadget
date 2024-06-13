import DateTimePicker from '@react-native-community/datetimepicker';
import { memo, useCallback, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '../styles/theme';

function TimePickerButton({
  label = '',
  time = new Date(),
  onConfirm = () => {},
}) {
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const showPicker = useCallback(() => setPickerVisibility(true), []);
  const hidePicker = useCallback(() => setPickerVisibility(false), []);

  const handleConfirm = useCallback(
    (event, selectedDate) => {
      hidePicker();
      if (event.type === 'dismissed') {
        return;
      }
      if (selectedDate && typeof onConfirm === 'function') {
        onConfirm(selectedDate);
      }
    },
    [hidePicker, onConfirm]
  );

  return (
    <>
      <TouchableOpacity onPress={showPicker} style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
      {isPickerVisible && (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={false}
          mode="time"
          onChange={handleConfirm}
          value={time}
        />
      )}
    </>
  );
}

export default memo(TimePickerButton);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing[2],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
