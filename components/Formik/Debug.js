import { Text, View } from 'react-native';
import global from '../../styles/global';

export default function Debug({ debug, formikProps }) {
  if (!debug) {
    return null;
  }

  return (
    <View>
      <Text style={global.debugContainer}>
        {JSON.stringify(formikProps, null, 2)}
      </Text>
    </View>
  );
}
