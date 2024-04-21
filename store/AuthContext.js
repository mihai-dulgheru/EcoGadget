import { createContext, useMemo, useState } from 'react';
import AsyncStorage from '../utils/AsyncStorage';

export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  authenticate: async () => {},
  signOut: async () => {},
});

function AuthContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState();

  async function authenticate(token) {
    setAccessToken(token);
    await AsyncStorage.setItem('token', token);
  }

  async function signOut() {
    setAccessToken(null);
    await AsyncStorage.removeItem('token');
  }

  const currentUser = useMemo(
    () => ({
      token: accessToken,
      isAuthenticated: !!accessToken,
      authenticate,
      signOut,
    }),
    [accessToken]
  );

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
}

export default AuthContextProvider;
