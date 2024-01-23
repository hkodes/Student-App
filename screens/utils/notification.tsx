import PushNotification from 'react-native-push-notification';

export const sendLocalNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    channelId: '1',
    title: title,
    message: message,
  });
};
