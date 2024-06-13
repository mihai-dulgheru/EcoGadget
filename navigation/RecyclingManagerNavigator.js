import { getHeaderTitle } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isEmpty } from 'lodash';
import { Header } from '../components/UI';
import {
  MessageDetailScreen,
  MessageListScreen,
  RecyclingLocationEditScreen,
  RecyclingLocationListScreen,
  RecyclingManagerDashboardScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

const renderHeader = ({ route, options, navigation }) => {
  const title = getHeaderTitle(options, route.name);
  const canGoBack = navigation.canGoBack();
  return <Header title={title} canGoBack={canGoBack} />;
};

export default function RecyclingManagerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen
        name="RecyclingManagerDashboard"
        component={RecyclingManagerDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecyclingLocationList"
        component={RecyclingLocationListScreen}
        options={{ title: 'Locații de reciclare' }}
      />
      <Stack.Screen
        name="RecyclingLocationEdit"
        component={RecyclingLocationEditScreen}
        options={({ route }) => ({
          title:
            route.params.location && !isEmpty(route.params.location)
              ? 'Editare locație'
              : 'Adăugare locație',
        })}
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
