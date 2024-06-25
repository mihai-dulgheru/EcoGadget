import { StyleSheet } from 'react-native';
import theme from './theme';

const global = StyleSheet.create({
  border0: {
    borderBottomWidth: theme.borderWidth[0],
    borderEndWidth: theme.borderWidth[0],
    borderLeftWidth: theme.borderWidth[0],
    borderRightWidth: theme.borderWidth[0],
    borderStartWidth: theme.borderWidth[0],
    borderTopWidth: theme.borderWidth[0],
    borderWidth: theme.borderWidth[0],
  },
  debugContainer: {
    ...theme.fontSize.sm,
    backgroundColor: '#F9D6D5',
    borderRadius: theme.borderRadius.default,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.body,
    padding: theme.spacing[2],
  },
  pressed: { opacity: theme.opacity.pressed },
  spacingSmall: { gap: theme.spacing[2] },
  spacingMedium: { gap: theme.spacing[4] },
  spacingLarge: { gap: theme.spacing[6] },
  spacingXLarge: { gap: theme.spacing[8] },
  // Flex
  flex1: { flex: 1 },
  // Flex Grow
  grow: { flexGrow: 1 },
  // Font Weight
  fontThin: { fontWeight: '100' },
  fontExtraLight: { fontWeight: '200' },
  fontLight: { fontWeight: '300' },
  fontNormal: { fontWeight: '400' },
  fontMedium: { fontWeight: '500' },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
  fontExtraBold: { fontWeight: '800' },
  fontBlack: { fontWeight: '900' },
  // Justify Content
  justifyNormal: { justifyContent: 'normal' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  justifyStretch: { justifyContent: 'stretch' },
  // Text Transform
  uppercase: { textTransform: 'uppercase' },
  lowercase: { textTransform: 'lowercase' },
  capitalize: { textTransform: 'capitalize' },
  normalCase: { textTransform: 'none' },
});

export default global;
