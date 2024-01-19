import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Toast from 'react-native-simple-toast';
import { ParamListBase } from '@react-navigation/native';

export function width(percentage: number) {
  const value = (percentage * Dimensions.get('window').width) / 100;
  return Math.round(value);
}

export function height(percentage: number) {
  const value = (percentage * Dimensions.get('window').height) / 100;
  return Math.round(value);
}

export const commonStyles = StyleSheet.create({
  lableText: {
    letterSpacing: 1,
    fontSize: 15,
    color: "grey",
  },

  inputText: {
    color: 'black',
    marginTop: 5,
    height: height(5.5),
    borderColor: '#ccc',
    borderWidth: 1.6,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

const firebaseConfig = {
  apiKey: 'AIzaSyAGX6YHyQZ8L3UYdIIQzOuKjhXQ9Bi090w',
  authDomain: 'student-info-3987d.firebaseapp.com',
  projectId: 'student-info-3987d',
  storageBucket: 'student-info-3987d.appspot.com',
  messagingSenderId: '752388232522',
  appId: '1:752388232522:android:670340a8c3b51524de9db3',
};

export default firebaseConfig;

export function showToast(message: string) {
  return Toast.show(message, 5);
}

export const tealColor = '#008080';


export interface RootParamList extends ParamListBase {
  Login: undefined;
  Dashboard: undefined;
  RegisterUser: {fcmToken: string};
}