import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  RootParamList,
  commonStyles,
  height,
  showToast,
  tealColor,
  width,
} from '../../constant';
import {useUser} from '../../provider/user_provider';
import TextInputs, {DisabledTextInput} from '../../common/text_field';
import HeaderComponent from '../dashboard/component/header';
import FooterComponent from '../dashboard/component/footer';
import ImagePickerComponent from '../dashboard/component/image_picker';
import DatePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GenderSelection} from '../auth/register';
import {createNotification} from '../../utils/firestore';

const Profile = () => {
  const [profilePic, setprofilePic] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [gender, setGender] = useState('male');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [DOB, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [selectedDate, setSelectedDate] = useState('DOB');
  const [showUpdate, setShowUpdate] = useState(false);
  const {user, login} = useUser();

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate.toISOString().split('T')[0]);
      setShowUpdate(true);
    }
    setDob(selectedDate);
  };
  const handleSubmit = async () => {
    try {
      setIsRegister(true);
      const currentUser = auth().currentUser;
      createNotification(
        currentUser!.uid,
        'Profile updated',
        'Profile updated successfully',
      );

      console.log(`changed name ${name}`);
      const userData = {
        id: currentUser!.uid,
        name: name,
        contact: currentUser!.phoneNumber ?? '',
        rollNo: rollNo,
        address: address,
        gender: gender,
        dob: selectedDate,
        photoUrl: profilePic,
      };
      await login(userData);

      await firestore()
        .collection('test_users')
        .doc(currentUser!.uid)
        .update(
          currentUser!.uid,
          currentUser!.phoneNumber ?? '',
          name,
          rollNo,
          selectedDate,
          gender,
          address,
          profilePic,
        );

      setIsRegister(false);
      setShowUpdate(false);
      showToast('Updated Successfully');
    } catch (err) {
      setIsRegister(false);
      showToast('Please try agian later');
      console.log(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setprofilePic(user?.photoUrl ?? '');
        setName(user?.name ?? '');
        setRollNo(user.rollNo ?? '');
        setAddress(user?.address ?? '');
        setSelectedDate(user?.dob ?? '');
        setGender(user?.gender ?? 'Male');
      }
      return () => {
        setprofilePic('');
        setName('');
        setRollNo('');
        setAddress('');
        setSelectedDate('');
        setGender('Male');
        setShowUpdate(false);
      };
    }, [user]),
  );

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <HeaderComponent></HeaderComponent>
      <ScrollView style={{paddingHorizontal: 20}}>
        <ImagePickerComponent
          setbool={setShowUpdate}
          selectedImage={profilePic}
          setSelectedImage={setprofilePic}></ImagePickerComponent>

        <TextInputs
          label="Name"
          hintText="Enter Name"
          text={name}
          setText={setName}
          setBool={setShowUpdate}
        />
        <TextInputs
          label="Roll Number"
          hintText="Roll Number"
          text={rollNo}
          setText={setRollNo}
          setBool={setShowUpdate}
          keyboardType="number-pad"
        />
        <Text style={[commonStyles.lableText, {marginTop: '5%'}]}>
          Date of Birth
        </Text>
        <View
          style={[commonStyles.inputText, {justifyContent: 'center'}]}
          onTouchStart={ect => setShowDatePicker(true)}>
          <Text
            style={{
              textAlign: 'left',
              color: selectedDate === 'DOB' ? 'grey' : 'black',
            }}>
            {selectedDate}
          </Text>
        </View>
        {showDatePicker && (
          <DatePicker
            testID="dateTimePicker"
            value={DOB}
            mode={'date'}
            display="default"
            textColor="black"
            accentColor={tealColor}
            onChange={handleDateChange}
          />
        )}
        <GenderSelection
          gender={gender}
          setBool={setShowUpdate}
          setGender={setGender}></GenderSelection>
        <TextInputs
          label="Address"
          hintText="Address"
          text={address}
          setText={setAddress}
          setBool={setShowUpdate}
        />
        {!showUpdate ? (
          <View style={{marginBottom: '20%'}}></View>
        ) : (
          <>
            {isRegister ? (
              <ActivityIndicator
                style={{marginTop: 20}}
                size="large"
                color={tealColor}
              />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  commonStyles.continueBtn,
                  {marginTop: '10%', marginBottom: '20%'},
                ]}>
                <View>
                  <Text style={{color: 'white', fontSize: 17}}>Update</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
      <FooterComponent></FooterComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  educationTxt: {
    fontWeight: '800',
    alignSelf: 'center',
    letterSpacing: 1,
    fontSize: 23,
    color: tealColor,
    marginTop: height(1.5),
  },
  underline: {
    marginTop: 5,
    width: '25%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: 'black',
  },
  circleContainer: {
    elevation: 5,
    marginTop: '7%',
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginTop: 20,
  },
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Profile;
