import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  RecyclingCenterDetailsScreen,
  RecyclingInfoDetailsScreen,
  RecyclingInfoScreen,
  RecyclingLocationsScreen,
} from '../screens';

function getTabIcon(route) {
  return function ({ focused, color, size }) {
    let iconName;

    if (route.name === 'RecyclingInfo') {
      iconName = focused ? 'information-circle' : 'information-circle-outline';
    } else if (route.name === 'RecyclingLocations') {
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

// TODO: Add stack navigator for each tab

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
        name="RecyclingInfo"
        component={RecyclingInfoScreen}
        options={{ title: 'Reciclare' }}
      />
      <Tab.Screen
        name="RecyclingInfoDetails"
        component={RecyclingInfoDetailsScreen}
        options={{
          title: 'Detalii Reciclare',
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="RecyclingLocations"
        component={RecyclingLocationsScreen}
        options={{ title: 'Locații Reciclare' }}
      />
      <Tab.Screen
        name="RecyclingCenterDetails"
        component={RecyclingCenterDetailsScreen}
        options={{
          title: 'Detalii Centru de Reciclare',
          tabBarButton: () => null,
        }}
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
