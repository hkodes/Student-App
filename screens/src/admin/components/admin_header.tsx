import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {height, tealColor, width} from '../../../constant';
import {useUser} from '../../../provider/user_provider';

export interface DrawerParamList extends ParamListBase {
  Login: undefined;
  RegisterUser: undefined;
}

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const AdminHeader = () => {
  const navigation = useNavigation<NavigationProp>();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const {logout} = useUser();

  const handleSignOut = async () => {
    Alert.alert('Logout Confirmation', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',

        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          logout();
          auth().signOut();
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
      },
    ]);
    // if (auth().currentUser) {
    //   await auth().signOut();
    // }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.text}>Admin</Text>

      <TouchableOpacity onPress={handleSignOut} style={styles.iconContainer}>
        <Text style={styles.placeholderContainer}>👋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 10,
    backgroundColor: tealColor,
    height: height(8),
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    marginTop: 1,
    marginRight: 5,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    height: height(4),
  },
  text: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
  },
  placeholderContainer: {
    fontSize: 27,
    marginRight: 15,
  },
});

export default AdminHeader;
