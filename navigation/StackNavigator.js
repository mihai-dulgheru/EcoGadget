import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { HomeScreen, InfoScreen, RecyclingLocationsScreen } from '../screens';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Acasă',
        }}
      />
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{
          title: 'Informații',
        }}
      />
      <Stack.Screen
        name="RecyclingLocations"
        component={RecyclingLocationsScreen}
        options={{
          title: 'Locații de Reciclare',
        }}
      />
    </Stack.Navigator>
  );
}
