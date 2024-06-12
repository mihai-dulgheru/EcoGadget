import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  MessageDetailScreen,
  MessageListScreen,
  RecyclingLocationEditScreen,
  RecyclingLocationListScreen,
  RecyclingManagerDashboardScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

export default function RecyclingManagerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecyclingManagerDashboard"
        component={RecyclingManagerDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="RecyclingLocationList"
        component={RecyclingLocationListScreen}
        options={{ title: 'Locații de reciclare' }}
      />
      <Stack.Screen
        name="RecyclingLocationEdit"
        component={RecyclingLocationEditScreen}
        options={{ title: 'Editare locație' }}
      />
      <Stack.Screen
        name="MessageList"
        component={MessageListScreen}
        options={{ title: 'Mesaje utilizatori' }}
      />
      <Stack.Screen
        name="MessageDetail"
        component={MessageDetailScreen}
        options={{ title: 'Detalii mesaj' }}
      />
    </Stack.Navigator>
  );
}
