import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  RootParamList,
  commonStyles,
  showToast,
  tealColor,
} from '../../constant';
import {useUser} from '../../provider/user_provider';
import {NotificationItem} from '../../models/notification_model';
import firestore from '@react-native-firebase/firestore';
import HeaderComponent from '../dashboard/component/header';
import FooterComponent from '../dashboard/component/footer';
import NotificationCard from './notification_card';
import {ScrollView} from 'react-native-gesture-handler';

const Notifications = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const {user} = useUser();
  const [notifications, setNotifications] = useState<NotificationItem[]>();
  const [isLoading, setisLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log('hits notification here');
      fetchNotificaion();
      return () => {};
    }, []),
  );

  const fetchNotificaion = async () => {
    setisLoading(true);
    try {
      const notificationsCollection = await firestore().collection(
        'test_notification',
      );
      const querySnapshot = notificationsCollection
        .where('userId', '==', user?.id)
        .get();

      const notificationsData = (await querySnapshot!).docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as NotificationItem[];

      setNotifications(notificationsData);
      setisLoading(false);
    } catch (err) {
      setisLoading(false);
      showToast('Something went wrong');
    }
  };

  const handleClose = async (notification: NotificationItem) => {
    Alert.alert(
      'Delete notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await firestore()
                .collection('test_notification')
                .doc(notification.id)
                .delete();
              fetchNotificaion();
            } catch (error) {
              console.error('Failed to update isClosed field:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent></HeaderComponent>
      <Text style={[commonStyles.educationTxt, {marginTop: '3%'}]}>
        Notifications
      </Text>
      <View style={commonStyles.underline}></View>

      {!isLoading ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: 10, marginBottom: '20%', marginHorizontal: 15}}>
          {notifications?.length ? (
            notifications?.map(notification => (
              <NotificationCard
                key={notification.id}
                id={notification.id}
                title={notification.title}
                timestamp={notification.timestamp}
                message={notification.message}
                onClose={() => handleClose(notification)}
              />
            ))
          ) : (
            <Text
              style={{
                alignSelf: 'center',
                marginTop: '10%',
                fontSize: 19,
                color: 'black',
              }}>
              No Notifications found
            </Text>
          )}
        </ScrollView>
      ) : (
        <ActivityIndicator
          style={{marginTop: '20%'}}
          size="large"
          color={tealColor}
        />
      )}
      <FooterComponent></FooterComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Notifications;
