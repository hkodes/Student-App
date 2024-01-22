import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Define the stack navigator types based on your screens
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;
type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;
type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

// Combine the navigation and route types for each screen
export type LoginProps = {
  route: LoginScreenRouteProp;
};

export type RegisterProps = {
  route: RegisterScreenRouteProp;
};

export type DashboardProps = {
  route: DashboardScreenRouteProp;
};
