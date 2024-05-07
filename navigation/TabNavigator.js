import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  RecyclingCenterDetailsScreen,
  RecyclingInfoDetailsScreen,
  RecyclingInfoScreen,
  RecyclingLocationsScreen,
} from '../screens';

function getTabIcon(route) {
  return function ({ focused, color, size }) {
    let iconName;

    if (route.name === 'RecyclingInfoTab') {
      iconName = focused ? 'information-circle' : 'information-circle-outline';
    } else if (route.name === 'RecyclingLocationsTab') {
      iconName = focused ? 'map' : 'map-outline';
    } else if (route.name === 'ApplianceManagement') {
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
        options={{ title: 'Detalii Reciclare' }}
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
        options={{ title: 'Locații Reciclare' }}
      />
      <Stack.Screen
        name="RecyclingCenterDetails"
        component={RecyclingCenterDetailsScreen}
        options={{ title: 'Detalii Centru de Reciclare' }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabIcon(route),
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="RecyclingInfoTab"
        component={RecyclingInfoStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="RecyclingLocationsTab"
        component={RecyclingLocationsStackNavigator}
        options={{ headerShown: false }}
      />
      {/* <Tab.Screen
          name="ApplianceManagement"
          component={ApplianceManagementScreen}
          options={{ title: 'Gestionare Electrocasnice' }}
        />
        <Tab.Screen
          name="UserAccount"
          component={UserAccountScreen}
          options={{ title: 'Cont Utilizator' }}
        /> */}
    </Tab.Navigator>
  );
}
