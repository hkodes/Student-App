import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  RootParamList,
  commonStyles,
  height,
  showToast,
  tealColor,
  width,
} from '../../constant';
import React, {useEffect, useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from 'react-native-confirmation-code-field';
import auth, {firebase} from '@react-native-firebase/auth';
import FadeInView from '../../animations';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUser} from '../../provider/user_provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {createNotification, updateFcm} from '../../utils/firestore';
import messaging from '@react-native-firebase/messaging';
import {sendLocalNotification} from '../../utils/notification';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 6});
  const [isOtpSent, setisOtpSent] = useState(false);
  const [isOtpLoading, setisOtpLoading] = useState(false);
  const [verificationId, setverificationId] = useState<any>();
  const [isVerifying, setisVerifying] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const {login} = useUser();

  const checkExistingUser = async (uid: string) => {
    const userDoc = await firestore().collection('test_users').doc(uid).get();
    console.log(userDoc.data);
    if (userDoc.exists) {
      await updateFcm(uid);
      const userData = {
        id: uid,
        name: userDoc.data()?.name,
        address: userDoc.data()?.address,
        roll_number: userDoc.data()?.roll_number,
        dob: userDoc.data()?.dob,
        gender: userDoc.data()?.gender,
        phoneNumber: phoneNumber,
        fcmToken: userDoc.data()?.fcmToken,
      };
      AsyncStorage.setItem('user', JSON.stringify(userData));
      login(userData);
      setisVerifying(false);
      navigation.navigate('Dashboard');
    } else {
      setisVerifying(false);
      navigation.navigate('Register', {number: phoneNumber, uid: uid});
    }
  };

  const sendOtp = async () => {
    if (phoneNumber.length == 13) {
      setisOtpLoading(true);
      try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setisOtpLoading(false);
        setisOtpSent(true);
        showToast(`OTP sent to ${phoneNumber}`);
        setverificationId(confirmation.verificationId);
      } catch (err) {
        console.log(err);
        setisOtpLoading(false);
        showToast('Something went wrong');
      }
    } else {
      showToast('Enter valid phone number');
    }
  };

  const verifyOtp = async () => {
    showToast('Verifying OTP');
    if (value.length == 6) {
      try {
        setisVerifying(true);

        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          value,
        );
        const userCredential = await auth().signInWithCredential(credential);
        if (phoneNumber == '+911111111111' && value == '111111') {
          navigation.navigate('Admin');
        } else {
          checkExistingUser(userCredential.user.uid);
        }
      } catch (err) {
        setisVerifying(false);
        showToast('Something went wrong');
      }
    } else {
      showToast('Enter valid OTP');
    }
  };

  return (
    <ScrollView style={{backgroundColor: Colors.white, paddingHorizontal: 20}}>
      <SplashImage></SplashImage>
      <Text style={styles.educationTxt}>EDUCATION</Text>
      <Text style={styles.studentAppTxt}>Student App</Text>
      <Text style={[commonStyles.lableText, {marginTop: '10%'}]}>
        Mobile Number
      </Text>
      <TextInput
        style={commonStyles.inputText}
        onChangeText={text => setPhoneNumber(text)}
        value={phoneNumber}
        placeholder="Enter Mobile Number"
        keyboardType="numeric"
        maxLength={13}></TextInput>
      {isOtpLoading ? (
        <ActivityIndicator
          style={{marginTop: 20}}
          size="large"
          color={tealColor}
        />
      ) : (
        <TouchableOpacity style={styles.button}>
          <View>
            <Text onPress={sendOtp} style={styles.buttonText}>
              Get OTP
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {isOtpSent ? (
        <FadeInView>
          <Text
            style={{
              alignSelf: 'center',
              color: 'grey',
              fontSize: 16,
              marginTop: 10,
            }}>
            OTP has been sent on your mobile number
          </Text>
          <CodeField
            ref={ref}
            value={value}
            onChangeText={setValue}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text key={index} style={[styles.cell]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <Text onPress={sendOtp} style={styles.resendText}>
            Resend
          </Text>
          {isVerifying ? (
            <ActivityIndicator
              style={{marginTop: 20}}
              size="large"
              color={tealColor}
            />
          ) : (
            <TouchableOpacity
              onPress={verifyOtp}
              style={commonStyles.continueBtn}>
              <View>
                <Text style={{color: Colors.white, fontSize: 17}}>
                  Continue
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </FadeInView>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  educationTxt: {
    fontWeight: '800',
    alignSelf: 'center',
    letterSpacing: 1,
    fontSize: 23,
    color: 'black',
  },
  studentAppTxt: {
    alignSelf: 'center',
    color: 'grey',
    fontSize: 18,
    paddingTop: 5,
    paddingLeft: 20,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#D3D3D3',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#333',
    fontSize: 17,
  },
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    color: 'black',
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    marginTop: 5,
    borderBottomColor: '#D3D3D3',
    borderLeftColor: Colors.white,
    borderRightColor: Colors.white,
    borderTopColor: Colors.white,
    textAlign: 'center',
  },
  resendText: {
    marginTop: '5%',
    alignSelf: 'center',
    color: '#4169E1',
    fontSize: 17,
  },
});

function SplashImage(): React.JSX.Element {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          height: height(20),
          width: width(60),
          marginTop: 70,
          marginBottom: 15,
          resizeMode: 'contain',
        }}
        source={require('../../../assets/logo.png')}
      />
    </View>
  );
}

export default Login;
