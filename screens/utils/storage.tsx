import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/user_model';


// Save user data to AsyncStorage
const saveUserToStorage = async (user: User) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

// Retrieve user data from AsyncStorage
const getUserFromStorage = async () => {
  try {
    const userJSON = await AsyncStorage.getItem('user');
    return userJSON ? JSON.parse(userJSON) : null;
  } catch (error) {
    console.error('Error retrieving user from storage:', error);
    return null;
  }
};
