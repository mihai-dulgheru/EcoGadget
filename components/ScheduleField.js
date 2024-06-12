import { set } from 'date-fns';
import { useField } from 'formik';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DEFAULT_TIME_RANGE } from '../constants';
import theme from '../styles/theme';
import { convertTo24HourFormat } from '../utils/DateUtils';
import ClosedCheckbox from './ClosedCheckbox';
import TimePickerButton from './TimePickerButton';

export default function ScheduleField({ label, formikProps, name }) {
  const [field] = useField(name);

  const isClosed = useMemo(() => field.value === 'Closed', [field.value]);
  const schedule = useMemo(() => {
    if (isClosed) return { start: '', end: '' };
    let times = field.value?.split(' - ');
    if (times.length !== 2) times = DEFAULT_TIME_RANGE.split(' - ');
    return {
      start: convertTo24HourFormat(times[0]),
      end: convertTo24HourFormat(times[1]),
    };
  }, [field.value]);

  const initialStartTime = useMemo(() => {
    const [hours, minutes] = schedule.start.split(':').map(Number);
    return set(new Date(), { hours, minutes });
  }, [schedule.start]);

  const initialEndTime = useMemo(() => {
    const [hours, minutes] = schedule.end.split(':').map(Number);
    return set(new Date(), { hours, minutes });
  }, [schedule.end]);

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const handleConfirmStart = (selectedDate) => {
    setStartTime(selectedDate);
    const formattedDate = selectedDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    formikProps.setFieldValue(
      name,
      `${formattedDate} - ${field.value?.split(' - ')[1] || ''}`
    );
  };

  const handleConfirmEnd = (selectedDate) => {
    setEndTime(selectedDate);
    const formattedDate = selectedDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    formikProps.setFieldValue(
      name,
      `${field.value?.split(' - ')[0] || ''} - ${formattedDate}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {!isClosed && (
        <View style={styles.timePickers}>
          <TimePickerButton
            key={`start-${field.value}`}
            label={field.value?.split(' - ')[0] || 'Ora de începere'}
            time={startTime}
            onConfirm={handleConfirmStart}
          />
          <TimePickerButton
            key={`end-${field.value}`}
            label={field.value?.split(' - ')[1] || 'Ora de încheiere'}
            time={endTime}
            onConfirm={handleConfirmEnd}
          />
        </View>
      )}
      <ClosedCheckbox
        isClosed={isClosed}
        setIsClosed={(newValue) =>
          formikProps.setFieldValue(
            name,
            newValue ? 'Closed' : DEFAULT_TIME_RANGE
          )
        }
        label="Închis"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing['2'],
  },
  label: {
    ...theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
  },
  timePickers: {
    flexDirection: 'row',
    gap: theme.spacing['2'],
    justifyContent: 'space-between',
  },
});
