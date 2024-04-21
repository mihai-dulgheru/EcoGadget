import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  InfoScreen,
  RecyclingCenterDetailsScreen,
  RecyclingLocationsScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

export default function NavigationStack() {
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
      <Stack.Screen
        name="RecyclingCenterDetails"
        component={RecyclingCenterDetailsScreen}
        options={{
          title: 'Detalii Centru de Reciclare',
        }}
      />
    </Stack.Navigator>
  );
}
