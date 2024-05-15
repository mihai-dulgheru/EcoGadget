import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

/**
 * Format date to 'd MMMM yyyy' format
 * @param {*} date - date to format
 * @returns {string} - formatted date
 */
function formatDate(date) {
  return format(date, 'd MMMM yyyy', { locale: ro });
}

export { formatDate };
