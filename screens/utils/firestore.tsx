import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {getLocation} from './location';
import {showToast} from '../constant';

export const createNotification = async (
  uid: string,
  title: string,
  body: string,
) => {
  await firestore().collection('test_notification').add({
    userId: uid,
    title: title,
    message: body,
    timestamp: firestore.Timestamp.now(),
  });
};

export const createNewUser = async (
  uid: string,
  phoneNumber: string,
  name: string,
  rollNo: string,
  dob: string,
  gender: string,
  address: string,
  photoUrl?: string,
) => {
  const fcmToken = await messaging().getToken();

  // PermissionsAndroid requests
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  const deviceId = await DeviceInfo.getUniqueId();

  const location = await getLocation();

  await firestore().collection('test_users').doc(uid).set({
    uid: uid,
    roll_number: rollNo,
    name: name,
    dob: dob,
    gender: gender,
    address: address,
    phoneNumber: phoneNumber,
    fcmToken: fcmToken,
    deviceId: deviceId,
    isRegistered: false,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    courses: [],
    notifications: [],
    photoUrl: photoUrl,
  });
};

export const updateFcm = async (uid: string) => {
  const fcmToken = await messaging().getToken();

  await firestore().collection('test_users').doc(uid).update({
    fcmToken: fcmToken,
  });
  console.log(`token updated to ${fcmToken}`);
};
