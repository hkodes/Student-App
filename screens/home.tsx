import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from './constant';



const Home = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();

  const logout = () => {
      navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }

  return   <View style={styles.container}>
  <TouchableOpacity onPress={logout} style={styles.button}>
    <Text style={styles.buttonText}>Logout</Text>
  </TouchableOpacity>
</View>
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

export default Home;
