import { StyleSheet, Text, View } from 'react-native';
import theme from '../styles/theme';

const getColorFromInitials = (initials) => {
  const colors = [
    '#FF6347',
    '#4682B4',
    '#FFD700',
    '#20B2AA',
    '#9370DB',
    '#FF69B4',
  ];
  let sumChars = 0;
  for (let i = 0; i < initials.length; i += 1) {
    sumChars += initials.charCodeAt(i);
  }
  return colors[sumChars % colors.length];
};

const getSize = (size) => {
  const sizeMap = {
    sm: 30,
    md: 50,
    lg: 70,
    xl: 90,
  };
  return sizeMap[size] || sizeMap.md;
};

const getSizeStyle = (size) => {
  const fontSize = getSize(size);
  return {
    width: fontSize,
    height: fontSize,
    borderRadius: fontSize / 2,
    backgroundColor: getColorFromInitials('AB'), // Assume 'AB' is the initials for simplicity
    justifyContent: 'center',
    alignItems: 'center',
  };
};

export default function Avatar({ accountInfo, size = 'md' }) {
  const firstName = accountInfo?.firstName || '';
  const lastName = accountInfo?.lastName || '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const avatarColor = getColorFromInitials(initials);
  const avatarSizeStyle = getSizeStyle(size);

  return (
    <View
      style={[styles.avatar, avatarSizeStyle, { backgroundColor: avatarColor }]}
    >
      <Text style={[styles.avatarText, { fontSize: getSize(size) * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  avatarText: {
    color: 'white',
    fontFamily: theme.fontFamily.heading,
    marginTop: theme.spacing[1],
  },
});
