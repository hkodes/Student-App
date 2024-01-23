import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import auth from '@react-native-firebase/auth';
import {DrawerParamList} from './header';
import {height} from '../../../constant';
import {useUser} from '../../../provider/user_provider';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

const FooterComponent = () => {
  const navigation = useNavigation<NavigationProp>();
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
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.iconContainer}>
        <Image
          source={require('../../../../assets/home.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.iconContainer}>
        <Image
          source={require('../../../../assets/logout.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingBottom: 6,
    paddingTop: 6,
    elevation: 10,
    bottom: 0,
    left: 0,
    right: 0,
    height: height(6),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconContainer: {
    height: '100%',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});

export default FooterComponent;
