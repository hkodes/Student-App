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
import {createNewUser} from '../../utils/firestore';
import {StackNavigationProp} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {useUser} from '../../provider/user_provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    selectedDate
      ? setSelectedDate(selectedDate.toISOString().split('T')[0])
      : '';
    setDob(selectedDate);
  };
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();

  const handleSubmit = async () => {
    if (rollNo && name && gender && address && selectedDate != 'DOB') {
      setIsRegister(true);
      const {login} = useUser();
      const currentUser = auth().currentUser;
      const userData = {
        id: currentUser!.uid,
        name: name,
        contact: currentUser!.phoneNumber ?? '',
        rollNo: rollNo,
        address: address,
        gender: gender,
        dob: selectedDate,
      };
      AsyncStorage.setItem('user', JSON.stringify(userData));
      login(userData);

      try {
        await createNewUser(
          currentUser!.uid,
          currentUser!.phoneNumber ?? '',
          name,
          rollNo,
          selectedDate,
          gender,
          address,
        );
        setIsRegister(false);
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
  };

  return (
    <ScrollView style={{paddingHorizontal: 18, backgroundColor: 'white'}}>
      <Text style={[styles.educationTxt, {marginTop: '6%'}]}>
        Complete your profile
      </Text>
      <View style={styles.underline}></View>
      <Image
        style={{
          alignSelf: 'center',
          height: height(15),
          width: width(60),
          marginTop: 30,
          marginBottom: 10,
          resizeMode: 'contain',
        }}
        source={require('../../../assets/nouser.png')}
      />

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
      />
      <Text style={[commonStyles.lableText, {marginTop: '5%'}]}>
        Date of Birth
      </Text>
      <View
        style={[commonStyles.inputText, {justifyContent: 'center'}]}
        onTouchStart={ect => setShowDatePicker(true)}>
        <Text style={{textAlign: 'left'}}>{selectedDate}</Text>
      </View>
      {showDatePicker && (
        <DatePicker
          testID="dateTimePicker"
          value={DOB}
          mode={'date'}
          display="default"
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
          style={[commonStyles.continueBtn, {marginTop: '10%'}]}>
          <View>
            <Text style={{color: 'white', fontSize: 17}}>Continue</Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const GenderSelection = ({
  gender,
  setGender,
}: {
  gender: string;
  setGender: (arg0: React.SetStateAction<string>) => void;
}) => {
  const handleGenderChange = (newGender: React.SetStateAction<string>) => {
    setGender(newGender);
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
            onPress={() => handleGenderChange('male')}
          />
          <Text style={commonStyles.lableText}>Male</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="female"
            color={tealColor}
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => handleGenderChange('female')}
          />
          <Text style={commonStyles.lableText}>Female</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="other"
            color={tealColor}
            status={gender === 'other' ? 'checked' : 'unchecked'}
            onPress={() => handleGenderChange('other')}
          />
          <Text style={commonStyles.lableText}>Other</Text>
        </View>
      </View>
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
    width: '60%',
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

export default Register;
