import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList, height, width} from '../../constant';
import {useUser} from '../../provider/user_provider';
import HeaderComponent from './component/header';
import FooterComponent from './component/footer';
import FieldContainer from './component/field_container';
import messaging from '@react-native-firebase/messaging';
import {createNotification} from '../../utils/firestore';
import {sendLocalNotification} from '../../utils/notification';

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const {user, logout} = useUser();

  const initMsgListener = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('bg msg');

      if (user) {
        createNotification(
          user?.id,
          remoteMessage.notification!['title'] ?? 'N/A',
          remoteMessage.notification!['body'] ?? 'N/A',
        );
        console.log('creates onBackground');
      }
    });

    messaging().onMessage(async remoteMessage => {
      console.log(`In app msg - ${user}`);  
      if (user) {
        sendLocalNotification(
          remoteMessage.notification!['title'] ?? 'N/A',
          remoteMessage.notification!['body'] ?? 'N/A',
        );
        createNotification(
          user?.id,
          remoteMessage.notification!['title'] ?? 'N/A',
          remoteMessage.notification!['body'] ?? 'N/A',
        );
        console.log(remoteMessage);
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      initMsgListener();
      return () => {};
    }, []),
  );

  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 15}}>
        <FieldContainer
          color="#f486c0"
          subColor="#f6a0cd"
          text="My Courses"></FieldContainer>
        <View style={{width: 10}}></View>
        <FieldContainer
          color="#8e8ffc"
          subColor="#a6a7fd"
          text="My Calendar"></FieldContainer>
      </View>
      <FieldContainer
        color="#90a9f1"
        subColor="#a7bbf4"
        setHeight={height(58)}
        setWidth={width(91)}
        text="Course Material"></FieldContainer>

      <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 15}}>
        <FieldContainer
          color="#86f8f4"
          subColor="#9df9f7"
          text="My Courses"></FieldContainer>
        <View style={{width: 10}}></View>
        <FieldContainer
          color="#86f8cd"
          subColor="#9dfad8"
          text="My Calendar"></FieldContainer>
      </View>
      {/* <Text>User Details:</Text>
      <Text>ID: {user?.id ?? ''}</Text>
      <Text>Name: {user?.name ?? ''}</Text>
      <Text>Email: {user?.contact ?? ''}</Text>
      <TouchableOpacity onPress={handleLogOut} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity> */}
      <FooterComponent></FooterComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
