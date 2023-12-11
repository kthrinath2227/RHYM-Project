
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ email: null, role: null} );
  
  const loginUser = (userData) => {
    // console.log('Updating User context:', userData);
    setUser(userData);
  }
  
  return (
    <UserContext.Provider value={{ user, setUser, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};

