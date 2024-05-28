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
        options={{ title: 'Locații de Reciclare' }}
      />
      <Stack.Screen
        name="RecyclingLocationEdit"
        component={RecyclingLocationEditScreen}
        options={{ title: 'Editare Locație' }}
      />
      <Stack.Screen
        name="MessageList"
        component={MessageListScreen}
        options={{ title: 'Mesaje Utilizatori' }}
      />
      <Stack.Screen
        name="MessageDetail"
        component={MessageDetailScreen}
        options={{ title: 'Detalii Mesaj' }}
      />
    </Stack.Navigator>
  );
}
