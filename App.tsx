import {
  CommonActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Login from './screens/src/auth/login';
import React, {useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/auth';
import firebaseConfig, {RootParamList, tealColor} from './screens/constant';
import {UserProvider, useUser} from './screens/provider/user_provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Register from './screens/src/auth/register';
import firestore from '@react-native-firebase/firestore';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Profile from './screens/src/profile/profile';
import Notifications from './screens/src/notification/notification';
import Dashboard from './screens/src/dashboard/dashboard';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App(): React.JSX.Element {
  const {user, login} = useUser();
  const [initialRoute, setInitialRoute] = useState<string>('Login');
  const Stack = createStackNavigator();
  const [loading, setLoading] = useState(true);

  const retrieveUserFromStorage = async () => {
    console.log({initialRoute});

    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const storedUser = JSON.parse(userJson);
        login(storedUser);
        const userDoc = await firestore()
          .collection('test_users')
          .doc(storedUser.id)
          .get({source: 'server'});
        if (userDoc.exists) {
          setInitialRoute('Dashboard');
        } else {
          setInitialRoute('Register');
        }
      } else {
        setInitialRoute('Login');
      }
    } catch (error) {
      console.log('Error retrieving user from storage:', error);
      setInitialRoute('Login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveUserFromStorage();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        style={{marginTop: 20, flex: 1, alignSelf: 'center'}}
        size="large"
        color={tealColor}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{headerShown: false, headerLeft: () => <></>}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AppWithUserProvider: React.FC = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default AppWithUserProvider;
