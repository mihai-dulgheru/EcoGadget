import { set } from 'date-fns';
import { useField } from 'formik';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DEFAULT_TIME_RANGE } from '../constants';
import global from '../styles/global';
import theme from '../styles/theme';
import { convertTo24HourFormat } from '../utils/DateUtils';
import ClosedCheckbox from './ClosedCheckbox';
import TimePickerButton from './TimePickerButton';

const formatTime = (date) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const getDateTime = (time) => {
  const [hours, minutes] = time?.split(':').map(Number) ?? [0, 0];
  return set(new Date(), { hours, minutes });
};

export default function ScheduleField({ label, name }) {
  const [field, , helpers] = useField(name);

  const initialValue =
    field.value === 'Closed' ? DEFAULT_TIME_RANGE : field.value;
  const initialTimes = initialValue?.split(' - ').map(convertTo24HourFormat);

  const [startTime, setStartTime] = useState(getDateTime(initialTimes[0]));
  const [endTime, setEndTime] = useState(getDateTime(initialTimes[1]));
  const [isClosed, setIsClosed] = useState(field.value === 'Closed');

  const handleConfirmStart = (selectedDate) => {
    setStartTime(selectedDate);
    const formattedDate = formatTime(selectedDate);
    helpers.setValue(
      `${formattedDate} - ${field.value?.split(' - ')[1] || ''}`
    );
  };

  const handleConfirmEnd = (selectedDate) => {
    setEndTime(selectedDate);
    const formattedDate = formatTime(selectedDate);
    helpers.setValue(
      `${field.value?.split(' - ')[0] || ''} - ${formattedDate}`
    );
  };

  const handleClosedChange = (value) => {
    setIsClosed(value);
    if (value) {
      helpers.setValue('Closed');
    } else {
      helpers.setValue(DEFAULT_TIME_RANGE);
      const defaultTimes = DEFAULT_TIME_RANGE?.split(' - ').map(
        convertTo24HourFormat
      );
      setStartTime(getDateTime(defaultTimes[0]));
      setEndTime(getDateTime(defaultTimes[1]));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {!isClosed && (
        <View style={styles.timePickers}>
          <TimePickerButton
            label={field.value?.split(' - ')[0] || 'Ora de începere'}
            onConfirm={handleConfirmStart}
            time={startTime}
          />
          <TimePickerButton
            label={field.value?.split(' - ')[1] || 'Ora de încheiere'}
            onConfirm={handleConfirmEnd}
            time={endTime}
          />
        </View>
      )}
      <ClosedCheckbox
        isClosed={isClosed}
        label="Închis"
        setIsClosed={handleClosedChange}
      />
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
  timePickers: {
    ...global.spacingSmall,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
