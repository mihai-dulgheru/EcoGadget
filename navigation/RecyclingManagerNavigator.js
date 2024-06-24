import { getHeaderTitle } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isEmpty } from 'lodash';
import { Header } from '../components/UI';
import {
  MessageDetailManagerScreen,
  MessageListManagerScreen,
  RecyclingLocationEditManagerScreen,
  RecyclingLocationListManagerScreen,
  RecyclingOverviewManagerScreen,
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
        name="RecyclingOverviewManager"
        component={RecyclingOverviewManagerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecyclingLocationListManager"
        component={RecyclingLocationListManagerScreen}
        options={{ title: 'Locații de reciclare' }}
      />
      <Stack.Screen
        name="RecyclingLocationEditManager"
        component={RecyclingLocationEditManagerScreen}
        options={({ route }) => ({
          title:
            route.params.location && !isEmpty(route.params.location)
              ? 'Editare locație'
              : 'Adăugare locație',
        })}
      />
      <Stack.Screen
        name="MessageListManager"
        component={MessageListManagerScreen}
        options={{ title: 'Mesaje utilizatori' }}
      />
      <Stack.Screen
        name="MessageDetailManager"
        component={MessageDetailManagerScreen}
        options={{ title: 'Detalii mesaj' }}
      />
    </Stack.Navigator>
  );
}
