import theme from '../styles/theme';

const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
const DEFAULT_LATITUDE = 44.4268;
const DEFAULT_LONGITUDE = 26.1025;
const DEFAULT_TIME_RANGE = '12:00 AM - 12:00 AM';
const MONTHS = [
  'Ian',
  'Feb',
  'Mar',
  'Apr',
  'Mai',
  'Iun',
  'Iul',
  'Aug',
  'Sep',
  'Oct',
  'Noi',
  'Dec',
];
const RIPPLE_CONFIG = {
  color: theme.colors.ripple,
  borderless: false,
  radius: theme.spacing[4],
  foreground: false,
};
const WEEKDAY_TRANSLATIONS = {
  monday: 'Luni',
  tuesday: 'Marți',
  wednesday: 'Miercuri',
  thursday: 'Joi',
  friday: 'Vineri',
  saturday: 'Sâmbătă',
  sunday: 'Duminică',
};

export {
  DAYS_OF_WEEK,
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  DEFAULT_TIME_RANGE,
  MONTHS,
  RIPPLE_CONFIG,
  WEEKDAY_TRANSLATIONS,
};
