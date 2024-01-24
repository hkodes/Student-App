import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  RootParamList,
  commonStyles,
  height,
  showToast,
  tealColor,
  width,
} from '../../constant';
import TextInputs from '../../common/text_field';
import {RadioButton} from 'react-native-paper';
import {RouteProp, useNavigation} from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker';
import {createNewUser, createNotification} from '../../utils/firestore';
import {StackNavigationProp} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {useUser} from '../../provider/user_provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePickerComponent from '../dashboard/component/image_picker';
import PushNotification from 'react-native-push-notification';
import {sendLocalNotification} from '../../utils/notification';

type RegisterUserScreenRouteProp = RouteProp<RootParamList, 'Register'>;

const Register = () => {
  const [rollNo, setRollNo] = useState('');
  const [gender, setGender] = useState('male');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [DOB, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [selectedDate, setSelectedDate] = useState('DOB');
  const [profilePic, setprofilePic] = useState('');

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    selectedDate
      ? setSelectedDate(selectedDate.toISOString().split('T')[0])
      : '';
    setDob(selectedDate);
  };
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const {login} = useUser();

  const handleSubmit = async () => {
    try {
      if (rollNo && name && gender && address && selectedDate != 'DOB') {
        setIsRegister(true);
        const currentUser = auth().currentUser;
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
        login(userData);

        try {
          await createNotification(
            currentUser!.uid,
            'Registration Successful',
            `Congratulations ${name}. You have successfully registered.`,
          );
          await createNewUser(
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
          sendLocalNotification(
            'Registration Successful',
            `Congratulations ${name}. You have successfully registered.`,
          );
          navigation.navigate('Dashboard');
        } catch (err) {
          setIsRegister(false);
          showToast('Please try agian later');
          console.log(err);
        }
      } else {
        setIsRegister(false);
        showToast('Please complete your profile');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{paddingHorizontal: 18, backgroundColor: 'white'}}>
      <Text style={[commonStyles.educationTxt, {marginTop: '7%'}]}>
        Complete your profile
      </Text>
      <View style={commonStyles.underline}></View>
      <ImagePickerComponent
        selectedImage={profilePic}
        setSelectedImage={setprofilePic}></ImagePickerComponent>

      <TextInputs
        label="Name"
        hintText="Enter Name"
        text={name}
        setText={setName}
      />
      <TextInputs
        label="Roll Number"
        hintText="Roll Number"
        text={rollNo}
        setText={setRollNo}
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
          maximumDate={new Date()}
          value={DOB}
          mode={'date'}
          display="default"
          accentColor={tealColor}
          textColor="black"
          onChange={handleDateChange}
        />
      )}
      <GenderSelection gender={gender} setGender={setGender}></GenderSelection>
      <TextInputs
        label="Address"
        hintText="Address"
        text={address}
        setText={setAddress}
      />
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
            {marginTop: '10%', marginBottom: '10%'},
          ]}>
          <View>
            <Text style={{color: 'white', fontSize: 17}}>Continue</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export const GenderSelection = ({
  gender,
  setGender,
  setBool,
}: {
  gender: string;
  setGender: (arg0: React.SetStateAction<string>) => void;
  setBool?: (bool: boolean) => void;
}) => {
  const handleGenderChange = (newGender: React.SetStateAction<string>) => {
    setGender(newGender);
    setBool;
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.lableText}>Select Gender:</Text>
      <View style={styles.rowContainer}>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="male"
            color={tealColor}
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => {
              handleGenderChange('male');
              if (setBool) {
                setBool(true);
              }
            }}
          />
          <Text style={commonStyles.lableText}>Male</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="female"
            color={tealColor}
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => {
              handleGenderChange('female');
              if (setBool) {
                setBool(true);
              }
            }}
          />
          <Text style={commonStyles.lableText}>Female</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="other"
            color={tealColor}
            status={gender === 'other' ? 'checked' : 'unchecked'}
            onPress={() => {
              handleGenderChange('other');
              if (setBool) {
                setBool(true);
              }
            }}
          />
          <Text style={commonStyles.lableText}>Other</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Register;
