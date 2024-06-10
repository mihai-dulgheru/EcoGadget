import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

/**
 * Convert a time string from 12-hour format to 24-hour format
 * @param {string} timeString - time string in 12-hour format
 * @returns {string} - time string in 24-hour format
 */
function convertTo24HourFormat(timeString) {
  if (!timeString) {
    return '';
  }
  const [time, modifier] = timeString.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  // Ensure hours and minutes are zero-padded
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * Format date to 'd MMMM yyyy' format
 * @param {*} date - date to format
 * @returns {string} - formatted date
 */
function formatDate(date) {
  return format(date, 'd MMMM yyyy', { locale: ro });
}

export { convertTo24HourFormat, formatDate };
