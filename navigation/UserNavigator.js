import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isEmpty } from 'lodash';
import { Header, TabBar } from '../components/UI';
import {
  AccountChangePasswordUserScreen,
  AccountChangePhoneNumberUserScreen,
  AccountOverviewUserScreen,
  AccountPersonalInfoUserScreen,
  AccountSettingsUserScreen,
  AccountUpdateNameUserScreen,
  ApplianceEditUserScreen,
  ApplianceListUserScreen,
  ApplianceStatisticsUserScreen,
  RecyclingCenterDetailUserScreen,
  RecyclingInfoDetailUserScreen,
  RecyclingInfoListUserScreen,
  RecyclingLocationListUserScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const noBackScreens = new Set([
  'RecyclingInfoListUser',
  'RecyclingLocationListUser',
  'ApplianceListUser',
  'AccountOverviewUser',
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
        name="RecyclingInfoListUser"
        component={RecyclingInfoListUserScreen}
        options={{ title: 'Informații reciclare' }}
      />
      <Stack.Screen
        name="RecyclingInfoDetailUser"
        component={RecyclingInfoDetailUserScreen}
        options={{ title: 'Detalii reciclare' }}
      />
    </Stack.Navigator>
  );
}

function RecyclingLocationsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen
        name="RecyclingLocationListUser"
        component={RecyclingLocationListUserScreen}
        options={{ title: 'Locații reciclare' }}
      />
      <Stack.Screen
        name="RecyclingCenterDetailUser"
        component={RecyclingCenterDetailUserScreen}
        options={{ title: 'Detalii centru de reciclare' }}
      />
    </Stack.Navigator>
  );
}

function ApplianceManagementStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Stack.Screen
        name="ApplianceListUser"
        component={ApplianceListUserScreen}
        options={{ title: 'Gestionare electrocasnice' }}
      />
      <Stack.Screen
        name="ApplianceEditUser"
        component={ApplianceEditUserScreen}
        options={({ route }) => ({
          title:
            route.params.appliance && !isEmpty(route.params.appliance)
              ? 'Editare electrocasnic'
              : 'Adăugare electrocasnic',
        })}
      />
      <Stack.Screen
        name="ApplianceStatisticsUser"
        component={ApplianceStatisticsUserScreen}
        options={{ title: 'Statistici și recomandări' }}
      />
    </Stack.Navigator>
  );
}

function UserAccountStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ header: renderHeader }}>
      <Tab.Screen
        name="AccountOverviewUser"
        component={AccountOverviewUserScreen}
        options={{ title: 'Cont' }}
      />
      <Tab.Screen
        name="AccountPersonalInfoUser"
        component={AccountPersonalInfoUserScreen}
        options={{ title: '' }}
      />
      <Tab.Screen
        name="AccountUpdateNameUser"
        component={AccountUpdateNameUserScreen}
        options={{ title: '' }}
      />
      <Tab.Screen
        name="AccountChangePhoneNumberUser"
        component={AccountChangePhoneNumberUserScreen}
        options={{ title: '' }}
      />
      <Tab.Screen
        name="AccountChangePasswordUser"
        component={AccountChangePasswordUserScreen}
        options={{ title: '' }}
      />
      <Tab.Screen
        name="AccountSettingsUser"
        component={AccountSettingsUserScreen}
        options={{ title: 'Setări cont' }}
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
        name="RecyclingInfo"
        component={RecyclingInfoStackNavigator}
        options={{ headerShown: false, title: 'Informații' }}
      />
      <Tab.Screen
        name="RecyclingLocations"
        component={RecyclingLocationsStackNavigator}
        options={{ headerShown: false, title: 'Locații' }}
      />
      <Tab.Screen
        name="ApplianceManagement"
        component={ApplianceManagementStackNavigator}
        options={{ headerShown: false, title: 'Electrocasnice' }}
      />
      <Tab.Screen
        name="UserAccount"
        component={UserAccountStackNavigator}
        options={{ headerShown: false, title: 'Cont' }}
      />
    </Tab.Navigator>
  );
}
