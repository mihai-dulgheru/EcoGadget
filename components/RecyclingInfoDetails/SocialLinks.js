import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SocialLinks({ links }) {
  if (!links) return null;
  return (
    <View>
      {Object.entries(links).map(([key, url]) => (
        <TouchableOpacity key={key} onPress={() => Linking.openURL(url)}>
          <Text style={{ color: 'blue' }}>{key.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
