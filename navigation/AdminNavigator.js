import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Header, TabBar } from '../components/UI';
import {
  AddUserAdminScreen,
  EditUserAdminScreen,
  RecyclingInfoListAdminScreen,
  RecyclingManagersAdminScreen,
  UsersAdminScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const noBackScreens = new Set([
  'RecyclingInfoListAdmin',
  'UsersAdmin',
  'RecyclingManagersAdmin',
  'AddUserAdmin',
]);

const renderHeader = ({ route, options, navigation }) => {
  const title = getHeaderTitle(options, route.name);
  const canGoBack = !noBackScreens.has(route.name) && navigation.canGoBack();
  return (
    <Header
      canGoBack={canGoBack}
      showSignOutButton={title === 'Reciclare'}
      title={title}
    />
  );
};

const renderTabBar = (props) => <TabBar {...props} />;

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ header: renderHeader }}
      tabBar={renderTabBar}
    >
      <Tab.Screen
        name="RecyclingInfoListAdmin"
        component={RecyclingInfoListAdminScreen}
        options={{ title: 'Reciclare' }}
      />
      <Tab.Screen
        name="UsersAdmin"
        component={UsersAdminScreen}
        options={{ title: 'Utilizatori' }}
      />
      <Tab.Screen
        name="RecyclingManagersAdmin"
        component={RecyclingManagersAdminScreen}
        options={{ title: 'Manageri' }}
      />
      <Tab.Screen
        name="AddUserAdmin"
        component={AddUserAdminScreen}
        options={{ title: 'Adaugă' }}
      />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditUserAdmin"
        component={EditUserAdminScreen}
        options={({ route }) => ({
          title:
            route.params?.user?.role === 'recycling_manager'
              ? 'Editare manager'
              : 'Editare utilizator',
        })}
      />
    </Stack.Navigator>
  );
}
