import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AdminHeader from './components/admin_header';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {showToast, tealColor} from '../../constant';

const AdminHome = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setisLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSending, setIsSending] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await firestore().collection('test_users').get();

      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      setUsers(usersData);
      setisLoading(false);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('hits notification here');
      fetchUsers();
      return () => {};
    }, []),
  );

  const renderItem = ({item, index}: {item: User; index: number}) => (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={styles.collapsibleContainer}
        onPress={() => handleUserPress(item.id)}>
        {item.photoUrl ? (
          <Image source={{uri: item.photoUrl}} style={styles.userImage} />
        ) : (
          <Text style={styles.placeholderContainer}>
            {item.gender == 'male' ? '🙍🏻‍♂️' : '👩🏻'}
          </Text>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userContact}>{item.phoneNumber}</Text>
        </View>
      </TouchableOpacity>

      {expandedUser === item.id && (
        <View>
          <View style={styles.expandedContent}>
            <Text
              style={{
                color: 'black',
                fontSize: 19,
                marginBottom: 10,
              }}>
              📍 {item.address}
            </Text>
            <Text style={{color: 'black', fontSize: 19, marginBottom: 15}}>
              🚻 {item.gender}
            </Text>
            <Text style={{color: 'black', fontSize: 19, marginBottom: 15}}>
              🎱 {item.roll_number}
            </Text>
            {/* Add other user details as needed */}
          </View>

          <TouchableOpacity
            style={styles.sendNotificationButton}
            onPress={() => handleSendNotification(item)}>
            <Text style={styles.buttonText}>Send Notification</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleUserPress = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleSendNotification = async (user: User) => {
    if (!user || !user.fcmToken) {
      showToast(`FCM not available for ${user.name}`);
      return;
    } else {
      setSelectedUser(user);
      toggleModal();
    }
  };

  const handleNotificationSend = async () => {
    Keyboard.dismiss();
    console.log(selectedUser?.fcmToken);
    if (!selectedUser?.fcmToken) {
      showToast('No Fcm found');
    } else {
      if (selectedUser) {
        setIsSending(true);
        try {
          // Construct the notification payload
          const notification = {
            to: selectedUser.fcmToken,
            notification: {
              title: notificationTitle,
              body: notificationMessage,
            },
          };
          setIsSending(true);
          // Send the notification
          const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'key=AAAAry3VVUo:APA91bHXx9YbsSXsjvBPd18JPVh_6wasD9zSTXH7i3smKc6KVJB0UF1PsRjR_CpEAMQ6DcMJQEOQDqfMGHh0oNnBIemf9AZAQdpd1zn_r44Zs_PwrySyBuo3fT8DfDBhZwb5YkUGcdQt',
            },
            body: JSON.stringify(notification),
          });
          console.log(response);
          if (response.ok) {
            setIsSending(false);
            toggleModal();
            showToast('Notification sent successfully');
          } else {
            setIsSending(false);
            toggleModal();

            showToast('Unable to send Notification');
          }
        } catch (error) {
          setIsSending(false);
          toggleModal();
          showToast('Something went wrong');
        }
      } else {
        // Close the custom dialog
        toggleModal();
      }
    }
    setNotificationTitle('');
    setNotificationMessage('');
    toggleModal();
  };

  return (
    <View style={styles.listContainer}>
      <AdminHeader></AdminHeader>
      {isLoading ? (
        <ActivityIndicator
          style={{
            marginTop: '20%',
            flex: 1,
            width: '100%',
            alignSelf: 'center',
          }}
          size="large"
          color={tealColor}
        />
      ) : (
        <View style={{marginTop: '3%'}}>
          <FlatList
            style={{marginHorizontal: 10, borderRadius: 20}}
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </View>
      )}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
          <Text style={styles.selectedUserName}>
            Send Notification to {selectedUser?.name}
          </Text>

          <TextInput
            style={styles.textInput}
            placeholder="Title"
            placeholderTextColor="grey"
            value={notificationTitle}
            onChangeText={text => setNotificationTitle(text)}
          />

          {/* Message Textfield */}
          <TextInput
            style={styles.messageInput}
            placeholder="Message"
            placeholderTextColor="grey"
            multiline
            value={notificationMessage}
            onChangeText={text => setNotificationMessage(text)}
          />

          {isSending ? (
            <ActivityIndicator
              style={{
                alignSelf: 'center',
              }}
              size="large"
              color={tealColor}
            />
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleNotificationSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light grey background for the entire list
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  container: {
    backgroundColor: '#d3d3d3',
    elevation: 10, // For Android elevation
    shadowColor: 'rgba(0, 0, 0, 0.1)', // For iOS shadow
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderRadius: 10,
    padding: 7,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    marginBottom: 10, // Add margin to create a gap between containers
  },
  collapsibleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
    color: 'black',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  userContact: {
    fontSize: 14,
    color: 'black',
  },
  expandedContent: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  placeholderContainer: {
    fontSize: 40,
    marginRight: 15,
  },
  sendNotificationButton: {
    backgroundColor: tealColor, // Green color, you can change it to your desired color
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  textInput: {
    color: 'black',
    backgroundColor: '#f0f0f0', // Light grey background
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 10,
    fontSize: 17,
  },
  messageInput: {
    color: 'black',
    fontSize: 17,
    backgroundColor: '#f0f0f0', // Light grey background
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 25,
    height: 100,
  },
  sendButton: {
    backgroundColor: tealColor, // Green color, you can change it to your desired color
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  sendButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedUserName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: tealColor,
    alignSelf: 'center',
    marginBottom: 15,
  },
});

export default AdminHome;
