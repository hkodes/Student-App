import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  RootParamList,
  commonStyles,
  height,
  tealColor,
  width,
} from '../../constant';
import {useUser} from '../../provider/user_provider';
import TextInputs, {DisabledTextInput} from '../../common/text_field';
import HeaderComponent from '../dashboard/component/header';
import FooterComponent from '../dashboard/component/footer';

const Profile = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const {user, logout} = useUser();

  const handleLogOut = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <HeaderComponent></HeaderComponent>
      <ScrollView style={{paddingHorizontal: 20}}>
        <Image
          style={{
            alignSelf: 'center',
            height: height(15),
            width: width(60),
            marginTop: 20,
            marginBottom: 10,
            resizeMode: 'contain',
          }}
          source={require('../../../assets/nouser.png')}
        />

        <DisabledTextInput
          text={user?.name ?? 'N/A'}
          label="Name"></DisabledTextInput>

        <DisabledTextInput
          text={user?.rollNo ?? 'N/A'}
          label="Roll Number"></DisabledTextInput>

        <DisabledTextInput
          text={user?.dob ?? 'N/A'}
          label="Date of Birth"></DisabledTextInput>

        <DisabledTextInput
          text={user?.gender ?? 'N/A'}
          label="Gender"></DisabledTextInput>

        <DisabledTextInput
          text={user?.address ?? 'N/A'}
          label="Address"></DisabledTextInput>
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
