import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import SplashScreen from './SplashScreen';
import NoInternetErrorScreen from './NoInternetErrorScreen';
import Profile from './Profile';
import EditProfile from './EditProfile';
import PartnersListCarousel from './PartnersListCarousel';
import PartnerDetail from './PartnerDetail';
import CallerVideoCallScreen from './CallerVideoCallScreen';
import RecieverVideoCallScreen from './RecieverVideoCallScreen';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';

const AppNavigator = createStackNavigator(
  {
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: () => ({
        header: null,
      }),
    },
    ForgetPassword: {
      screen: ForgetPassword,
      navigationOptions: () => ({
        header: null,
      }),
    },
    RecieverVideoCallScreen: {
      screen: RecieverVideoCallScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },

    CallerVideoCallScreen: {
      screen: CallerVideoCallScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    PartnerDetail: {
      screen: PartnerDetail,
      navigationOptions: () => ({
        header: null,
      }),
    },
    PartnersListCarousel: {
      screen: PartnersListCarousel,
      navigationOptions: () => ({
        header: null,
      }),
    },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Profile: {
      screen: Profile,
      navigationOptions: () => ({
        header: null,
      }),
    },
    NoInternetErrorScreen: {
      screen: NoInternetErrorScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    SignIn: {
      screen: SignIn,
      navigationOptions: () => ({
        header: null,
      }),
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Home: {
      screen: Home,
      navigationOptions: () => ({
        header: null,
      }),
    },
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'SplashScreen',
  },
);
const AppContainer = createAppContainer(AppNavigator);

export default class StackNavigator extends Component {
  render() {
    return <AppContainer />;
  }
}
