import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '../../constant';
import {useUser} from '../../provider/user_provider';

const Notifications = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const {user, logout} = useUser();

  const handleLogOut = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text>User Details:</Text>
      <Text>ID: {user?.id ?? ''}</Text>
      <Text>Name: {user?.name ?? ''}</Text>
      <Text>Email: {user?.email ?? ''}</Text>
      <TouchableOpacity onPress={handleLogOut} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
