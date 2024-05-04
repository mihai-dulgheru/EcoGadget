import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/UI';
import { AuthContext } from '../store/AuthContext';
import theme from '../styles/theme';

export default function HomeScreen() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bine ai venit!</Text>
      <Button onPress={() => navigation.navigate('RecyclingLocations')}>
        Vezi Locațiile de Reciclare
      </Button>
      <Button onPress={auth.signOut}>Deconectare</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing['6'],
    justifyContent: 'center',
  },
  text: {
    ...theme.fontSize.xl,
    marginBottom: theme.spacing['6'],
  },
});
