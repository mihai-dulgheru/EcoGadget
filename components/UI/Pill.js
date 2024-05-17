import { StyleSheet, Text, View } from 'react-native';

export default function Pill({ color, icon, children }) {
  return (
    <View style={[styles.root, styles[color]]}>
      <View style={styles.content}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={styles.text}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 24,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 12,
    backgroundColor: '#D1D1D1',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 14,
    height: 14,
    overflow: 'hidden',
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 23,
    fontWeight: 'bold',
  },
  green: {
    backgroundColor: '#D4EDE4',
    color: '#00703C',
  },
  red: {
    backgroundColor: '#F9D6D5',
    color: '#AE132B',
  },
  indigo: {
    backgroundColor: '#DDE0F8',
    color: '#2F3A8F',
  },
  blue: {
    backgroundColor: '#D0E8F2',
    color: '#005486',
  },
  yellow: {
    backgroundColor: '#FCEFC1',
    color: '#8A7000',
  },
  purple: {
    backgroundColor: '#EDE4F7',
    color: '#5D2D91',
  },
});
