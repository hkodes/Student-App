import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {height, width} from '../../../constant';
import {useUser} from '../../../provider/user_provider';

export interface DrawerParamList extends ParamListBase {
  Login: undefined;
  RegisterUser: undefined;
}

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const HeaderComponent = () => {
  const navigation = useNavigation<NavigationProp>();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const {user, logout} = useUser();

  useEffect(() => {
    // const fetchUserData = async () => {
    //   const user = auth().currentUser;
    //   if (user) {
    //     const userDoc = await firestore()
    //       .collection('Users')
    //       .doc(user.uid)
    //       .get();
    //     setUserData((userDoc.data() as UserData) || null);
    //   }
    // };
    // const fetchUnreadNotifications = async () => {
    //   const user = auth().currentUser;
    //   if (user) {
    //     const notifications = await firestore()
    //       .collection('Notifications')
    //       .where('userId', '==', user.uid)
    //       .where('isRead', '==', false)
    //       .get();
    //     setUnreadNotifications(notifications.docs.length);
    //   }
    // };
    // const intervalId = setInterval(() => {
    //   fetchUnreadNotifications();
    // }, 60000); // Check every minute
    // fetchUserData();
    // fetchUnreadNotifications();
    // return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.iconContainer}>
        <Image
          source={require('../../../../assets/menu.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.text}>{user ? `${user.name}` : 'Loading...'}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={styles.iconContainer}>
        <Image
          source={require('../../../../assets/notification.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        {unreadNotifications > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{unreadNotifications}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={styles.iconContainer}>
        <Image
          source={require('../../../../assets/profile.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        {unreadNotifications > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{unreadNotifications}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 10,
    backgroundColor: 'white',
    height: height(7),
    alignItems: 'center',
    justifyContent: 'space-between',
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
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
  },
  badgeContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 5,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
