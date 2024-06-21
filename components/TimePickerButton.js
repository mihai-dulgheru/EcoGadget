import DateTimePicker from '@react-native-community/datetimepicker';
import { memo, useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import global from '../styles/global';
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
      <Pressable
        onPress={showPicker}
        style={({ pressed }) => [styles.button, pressed && global.pressed]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
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
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    padding: theme.spacing[2],
  },
  buttonText: {
    ...theme.fontSize.base,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
});
