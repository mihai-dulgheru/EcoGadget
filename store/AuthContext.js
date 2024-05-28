import { createContext, useMemo, useState } from 'react';
import AsyncStorage from '../utils/AsyncStorage';

export const AuthContext = createContext({
  isSignedIn: false,
  token: null,
  user: null,
  authenticate: async () => {},
  signOut: async () => {},
});

function AuthContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState();
  const [user, setUser] = useState();

  async function authenticate({ idToken, email, localId, role }) {
    setAccessToken(idToken);
    setUser({ email, localId, role });
    await AsyncStorage.setItem('user', { idToken, email, localId, role });
  }

  async function signOut() {
    setAccessToken(null);
    setUser(null);
    await AsyncStorage.removeItem('user');
  }

  const currentUser = useMemo(
    () => ({
      isSignedIn: !!accessToken,
      token: accessToken,
      user,
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
