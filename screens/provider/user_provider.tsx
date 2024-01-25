import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const retrieveUserFromStorage = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('user');
      if (userJSON) {
        const storedUser: User = JSON.parse(userJSON);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error retrieving user from storage:', error);
    }
  };

  useEffect(() => {
    retrieveUserFromStorage();
  }, []);

  const login = (userData: User) => {
    try {
      AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log(`user set ${JSON.stringify(userData)}`);
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const logout = () => {
    try {
      AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  };

  const contextValue: UserContextProps = {
    user,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
