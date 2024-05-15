import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ApplianceEditScreen,
  ApplianceManagementScreen,
  RecyclingCenterDetailsScreen,
  RecyclingInfoDetailsScreen,
  RecyclingInfoScreen,
  RecyclingLocationsScreen,
  UserAccountScreen,
} from '../screens';
import theme from '../styles/theme';

function getTabIcon(route) {
  return function ({ focused, color, size }) {
    let iconName;

    if (route.name === 'RecyclingInfoTab') {
      iconName = focused ? 'information-circle' : 'information-circle-outline';
    } else if (route.name === 'RecyclingLocationsTab') {
      iconName = focused ? 'map' : 'map-outline';
    } else if (route.name === 'ApplianceManagementTab') {
      iconName = focused ? 'build' : 'build-outline';
    } else if (route.name === 'UserAccount') {
      iconName = focused ? 'person' : 'person-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RecyclingInfoStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecyclingInfo"
        component={RecyclingInfoScreen}
        options={{ title: 'Reciclare' }}
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
    <Stack.Navigator>
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
    <Stack.Navigator>
      <Stack.Screen
        name="ApplianceManagement"
        component={ApplianceManagementScreen}
        options={{ title: 'Gestionare electrocasnice' }}
      />
      <Stack.Screen
        name="ApplianceEdit"
        component={ApplianceEditScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabIcon(route),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      })}
    >
      <Tab.Screen
        name="RecyclingInfoTab"
        component={RecyclingInfoStackNavigator}
        options={{ headerShown: false, title: 'Reciclare' }}
      />
      <Tab.Screen
        name="RecyclingLocationsTab"
        component={RecyclingLocationsStackNavigator}
        options={{ headerShown: false, title: 'Locații reciclare' }}
      />
      <Tab.Screen
        name="ApplianceManagementTab"
        component={ApplianceManagementStackNavigator}
        options={{ headerShown: false, title: 'Gestionare electrocasnice' }}
      />
      <Tab.Screen
        name="UserAccount"
        component={UserAccountScreen}
        options={{ title: 'Cont utilizator' }}
      />
    </Tab.Navigator>
  );
}
