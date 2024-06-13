import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isEmpty } from 'lodash';
import { Header, TabBar } from '../components/UI';
import {
  ApplianceEditScreen,
  ApplianceManagementScreen,
  ApplianceStatisticsScreen,
  RecyclingCenterDetailsScreen,
  RecyclingInfoDetailsScreen,
  RecyclingInfoScreen,
  RecyclingLocationsScreen,
  UserAccountScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const noBackScreens = new Set([
  'RecyclingInfo',
  'RecyclingLocations',
  'ApplianceManagement',
  'UserAccount',
]);

const renderHeader = ({ route, options, navigation }) => {
  const title = getHeaderTitle(options, route.name);
  const canGoBack = !noBackScreens.has(route.name) && navigation.canGoBack();
  return <Header title={title} canGoBack={canGoBack} />;
};

const renderTabBar = (props) => <TabBar {...props} />;

function RecyclingInfoStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen
        name="RecyclingInfo"
        component={RecyclingInfoScreen}
        options={{ title: 'Informații reciclare' }}
      />
      <Stack.Screen
        name="RecyclingInfoDetails"
        component={RecyclingInfoDetailsScreen}
        options={{ title: 'Detalii reciclare' }}
      />
    </Stack.Navigator>
  );
}

function RecyclingLocationsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen
        name="RecyclingLocations"
        component={RecyclingLocationsScreen}
        options={{ title: 'Locații reciclare' }}
      />
      <Stack.Screen
        name="RecyclingCenterDetails"
        component={RecyclingCenterDetailsScreen}
        options={{ title: 'Detalii centru de reciclare' }}
      />
    </Stack.Navigator>
  );
}

function ApplianceManagementStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen
        name="ApplianceManagement"
        component={ApplianceManagementScreen}
        options={{ title: 'Gestionare electrocasnice' }}
      />
      <Stack.Screen
        name="ApplianceEdit"
        component={ApplianceEditScreen}
        options={({ route }) => ({
          title:
            route.params.appliance && !isEmpty(route.params.appliance)
              ? 'Editare electrocasnic'
              : 'Adăugare electrocasnic',
        })}
      />
      <Stack.Screen
        name="ApplianceStatistics"
        component={ApplianceStatisticsScreen}
        options={{ title: 'Statistici și recomandări' }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ header: renderHeader }}
      tabBar={renderTabBar}
    >
      <Tab.Screen
        name="RecyclingInfoTab"
        component={RecyclingInfoStackNavigator}
        options={{ headerShown: false, title: 'Informații' }}
      />
      <Tab.Screen
        name="RecyclingLocationsTab"
        component={RecyclingLocationsStackNavigator}
        options={{ headerShown: false, title: 'Locații' }}
      />
      <Tab.Screen
        name="ApplianceManagementTab"
        component={ApplianceManagementStackNavigator}
        options={{ headerShown: false, title: 'Electrocasnice' }}
      />
      <Tab.Screen
        name="UserAccount"
        component={UserAccountScreen}
        options={{ title: 'Cont' }}
      />
    </Tab.Navigator>
  );
}
