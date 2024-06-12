import { StyleSheet } from 'react-native';
import theme from './theme';

const global = StyleSheet.create({
  debugContainer: {
    ...theme.fontSize.sm,
    backgroundColor: '#F9D6D5',
    borderRadius: theme.borderRadius.default,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    padding: theme.spacing['2'],
  },
  spacingSmall: {
    gap: theme.spacing['2'],
  },
  spacingMedium: {
    gap: theme.spacing['4'],
  },
});

export default global;
