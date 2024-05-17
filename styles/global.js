import { StyleSheet } from 'react-native';
import theme from './theme';

const global = StyleSheet.create({
  debugContainer: {
    ...theme.fontSize.sm,
    backgroundColor: '#F9D6D5',
    borderRadius: theme.borderRadius.default,
    color: theme.colors.textPrimary,
    padding: theme.spacing['2'],
  },
  spacingSmall: {
    gap: theme.spacing['2'],
  },
});

export default global;
