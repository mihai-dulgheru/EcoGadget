import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/UI';
import { AuthContext } from '../store/AuthContext';

export default function HomeScreen() {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>HomeScreen</Text>
      <Button onPress={() => navigation.navigate('RecyclingLocations')}>
        Vezi Locațiile de Reciclare
      </Button>
      <Button onPress={authContext.signOut}>Deconectare</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
