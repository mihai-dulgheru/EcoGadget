import { NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import AdminNavigator from './AdminNavigator';
import AuthNavigation from './AuthNavigation';
import RecyclingManagerNavigator from './RecyclingManagerNavigator';
import UserNavigator from './UserNavigator';

export default function RoleBasedNavigation() {
  const auth = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!auth.isSignedIn && <AuthNavigation />}
      {auth.isSignedIn && auth.user?.role === 'admin' && <AdminNavigator />}
      {auth.isSignedIn && auth.user?.role === 'recycling_manager' && (
        <RecyclingManagerNavigator />
      )}
      {auth.isSignedIn && auth.user?.role === 'user' && <UserNavigator />}
    </NavigationContainer>
  );
}
