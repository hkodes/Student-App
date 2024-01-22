import React, {useEffect} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Profile from '../profile/profile';
import {CommonActions, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Login from '../auth/login';
import Notifications from '../notification/notification';
import Home from './home';
import {useUser} from '../../provider/user_provider';
import {tealColor} from '../../constant';
import FooterComponent from './component/footer';

function Dashboard(): React.JSX.Element {
  const {user, logout} = useUser();

  function Logout() {
    const navigation = useNavigation();
    if (auth().currentUser) {
      auth().signOut();
    }
    useEffect(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
            },
          ],
        }),
      );
    }, [navigation]);

    return <Login></Login>;
  }
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          drawerActiveTintColor: tealColor,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          drawerActiveTintColor: tealColor,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          drawerActiveTintColor: tealColor,
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{headerShown: false, unmountOnBlur: true}}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentContainer: {
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default Dashboard;
