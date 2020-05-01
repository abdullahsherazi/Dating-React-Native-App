import * as actionTypes from './types';
import {NavigationActions, StackActions} from 'react-navigation';
import axios from 'axios';
import server from '../../constants/server';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
// import * as paginationConstants from "../../constants/paginationConstants";

export const signup = (navigation, userdata, toast) => async dispatch => {
  dispatch({type: actionTypes.START_LOADING});
  userdata = {
    ...userdata,
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQG-GWp9R0p9UrshUAZRiOiH-62eKWwyBOlInissnsMS3PeiPp0',
  };
  axios
    .post(server + 'users/signup', userdata)
    .then(response => {
      if (response.status === 200) {
        let data = {
          ...response.data,
        };
        delete data.msg;
        AsyncStorage.setItem('userdata', JSON.stringify(data)).then(() => {
          dispatch({
            type: actionTypes.SET_USER_DATA,
            payload: data,
          });
          navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Home',
                }),
              ],
            }),
          );
          dispatch({type: actionTypes.NOT_LOADING});
        });
      } else {
        dispatch({type: actionTypes.NOT_LOADING});
        toast.show(
          'Some Problem Occured While Signing You Up, Try Again',
          2000,
        );
      }
    })
    .catch(error => {
      dispatch({type: actionTypes.NOT_LOADING});
      if (error.response.status === 409) {
        toast.show('This Email Address Already Exists', 2500);
      } else {
        toast.show(
          'Some Problem Occured While Signing You Up, Try Again',
          2000,
        );
      }
    });
};

export const signin = (navigation, userdata, toast) => async dispatch => {
  dispatch({type: actionTypes.START_LOADING});
  axios
    .post(server + 'users/signin', userdata)
    .then(response => {
      if (response.status === 200) {
        let data = {
          ...response.data,
        };
        delete data.msg;
        AsyncStorage.setItem('userdata', JSON.stringify(data)).then(() => {
          dispatch({
            type: actionTypes.SET_USER_DATA,
            payload: data,
          });
          navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Home',
                }),
              ],
            }),
          );
          dispatch({type: actionTypes.NOT_LOADING});
        });
      } else {
        dispatch({type: actionTypes.NOT_LOADING});
        toast.show(
          'Some Problem Occured While Signing You In, Try Again',
          2000,
        );
      }
    })
    .catch(error => {
      dispatch({type: actionTypes.NOT_LOADING});
      if (error.response.status === 401) {
        toast.show('Wrong Credentials', 2500);
      } else if (error.response.status === 500) {
        toast.show("This Email Address Doesn't Exist", 2500);
      } else {
        toast.show(
          'Some Problem Occured While Signing You In, Try Again',
          2000,
        );
      }
    });
};

export const checkUser = navigation => async dispatch => {
  AsyncStorage.getItem('userdata').then(data => {
    let userdata = JSON.parse(data);
    if (userdata) {
      dispatch({
        type: actionTypes.SET_USER_DATA,
        payload: userdata,
      });
      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
            }),
          ],
        }),
      );
    } else
      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'SignIn',
            }),
          ],
        }),
      );
  });
};

export const signout = navigation => async dispatch => {
  AsyncStorage.removeItem('userdata').then(() => {
    // dispatch({
    //   type: actionTypes.CLEAR_ALL_DATA,
    // });
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'SignIn',
          }),
        ],
      }),
    );
  });
};
export const uploadProfilePic = (
  userdata,
  imageResponse,
  toast,
) => async dispatch => {
  dispatch({type: actionTypes.START_LOADING});
  var formData = new FormData();
  formData.append('file', {
    uri: imageResponse.path,
    type: imageResponse.mime,
    name: imageResponse.path.split('/').pop(),
  });
  formData.append('emailAddress', userdata.emailAddress);
  // console.warn(imageResponse);
  // console.warn(formData);
  axios
    .post(server + 'users/uploadProfilePic', formData, {
      headers: {
        'Content-type': 'multipart/form-data',
        'x-access-token': userdata.token,
      },
    })
    .then(response => {
      if (response.status === 200) {
        let data = {
          ...userdata,
          avatar: response.data.avatar,
        };
        AsyncStorage.setItem('userdata', JSON.stringify(data)).then(() => {
          dispatch({
            type: actionTypes.SET_USER_DATA,
            payload: data,
          });
          dispatch({type: actionTypes.NOT_LOADING});
        });
      } else {
        dispatch({type: actionTypes.NOT_LOADING});
        toast.show(
          'Some Problem Occured While Uploading Your Profile Pic, Try Again',
          2000,
        );
      }
    })
    .catch(error => {
      dispatch({type: actionTypes.NOT_LOADING});
      console.log(error);
      toast.show(
        'Some Problem Occured While Uploading Your Profile Pic, Try Again',
        2000,
      );
    });
};

export const updateUserInformation = (
  userdata,
  navigation,
  toast,
) => async dispatch => {
  dispatch({type: actionTypes.START_LOADING});
  axios
    .post(server + 'users/updateProfile', userdata, {
      headers: {
        'x-access-token': userdata.token,
      },
    })
    .then(response => {
      if (response.status === 200) {
        AsyncStorage.setItem('userdata', JSON.stringify(userdata)).then(() => {
          dispatch({
            type: actionTypes.SET_USER_DATA,
            payload: userdata,
          });
          navigation.goBack();
          dispatch({type: actionTypes.NOT_LOADING});
        });
      } else {
        dispatch({type: actionTypes.NOT_LOADING});
        toast.show(
          'Some Problem Occured While Updating Your Profile, Try Again',
          2000,
        );
      }
    })
    .catch(() => {
      dispatch({type: actionTypes.NOT_LOADING});
      toast.show(
        'Some Problem Occured While Updating Your Profile, Try Again',
        2000,
      );
    });
};

export const activateLocation = (
  navigation,
  userdata,
  switchtoggleFunc,
  toast,
) => async dispatch => {
  dispatch({
    type: actionTypes.START_LOADING,
  });
  Geolocation.getCurrentPosition(
    position => {
      let data = {
        emailAddress: userdata.emailAddress,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      axios
        .post(server + 'users/updateLocation', data, {
          headers: {
            'x-access-token': userdata.token,
          },
        })
        .then(response => {
          if (response.status === 200) {
            let data = {...userdata, location: response.data.location};
            AsyncStorage.setItem('userdata', JSON.stringify(data)).then(() => {
              dispatch({
                type: actionTypes.SET_USER_DATA,
                payload: data,
              });
              dispatch({type: actionTypes.NOT_LOADING});
            });
          } else {
            switchtoggleFunc();
            dispatch({type: actionTypes.NOT_LOADING});
            toast.show(
              'Some Problem Occured While Updating Your Location, Try Again',
              2000,
            );
          }
        })
        .catch(() => {
          switchtoggleFunc();
          dispatch({type: actionTypes.NOT_LOADING});
          toast.show(
            'Some Problem Occured While Updating Your Location, Try Again',
            2000,
          );
        });
    },
    () => {
      switchtoggleFunc();
      dispatch({type: actionTypes.NOT_LOADING});
      toast.show('Slow Internet or Location Not Enabled. Try Again', 2000);
    },
    {enableHighAccuracy: false, timeout: 5000},
  );
};

export const searchPartners = (
  navigation,
  userdata,
  toast,
) => async dispatch => {
  dispatch({type: actionTypes.START_LOADING});
  if (Object.keys(userdata.location).length === 0) {
    dispatch({type: actionTypes.NOT_LOADING});
    toast.show('First Activate Your Location', 2000);
  } else {
    let data = {
      lat: userdata.location.coordinates[0],
      lng: userdata.location.coordinates[1],
      maxDistance: 15000,
    };
    axios
      .post(server + 'users/findPeople', data, {
        headers: {
          'x-access-token': userdata.token,
        },
      })
      .then(response => {
        if (response.status === 200) {
          if (response.data.partners.length > 0) {
            let partners = [];
            for (let i = 0; i < response.data.partners.length; i++) {
              if (userdata.gender !== response.data.partners[i].gender) {
                partners.push(response.data.partners[i]);
              }
            }
            if (partners.length > 0) {
              dispatch({
                type: actionTypes.SET_PARTNERS,
                payload: partners,
              });
              dispatch({type: actionTypes.NOT_LOADING});
              navigation.navigate('PartnersListCarousel');
            } else {
              dispatch({type: actionTypes.NOT_LOADING});
              toast.show('No Partner Found in 15 km Radius', 2500);
            }
          } else {
            dispatch({type: actionTypes.NOT_LOADING});
            toast.show('No Partner Found in 15 km Radius', 2500);
          }
        } else {
          dispatch({type: actionTypes.NOT_LOADING});
          toast.show(
            'Some Problem Occured While Finding Your Partners, Try Again',
            2000,
          );
        }
      })
      .catch(error => {
        dispatch({type: actionTypes.NOT_LOADING});
        toast.show(
          'Some Problem Occured While Finding Your Partners, Try Again',
          2000,
        );
      });
  }
};
export const resetPassword = (
  navigation,
  userdata,
  toast,
  forget,
) => async dispatch => {
  dispatch({type: actionTypes.START_LOADING});
  firebase
    .auth()
    .sendPasswordResetEmail(userdata.emailAddress)
    .then(() => {
      dispatch({type: actionTypes.NOT_LOADING});
      navigation.goBack();
      alert('Reset Password Email Has Been Sent To ' + userdata.emailAddress);
    })
    .catch(error => {
      dispatch({type: actionTypes.NOT_LOADING});
      toast.show(error.message, 2500);
    });
};

export const internetListener = (navigation, checkUser) => async dispatch => {
  NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'NoInternetErrorScreen',
            }),
          ],
        }),
      );
    } else {
      checkUser();
    }
  });
  NetInfo.addEventListener(async state => {
    connected = state.isConnected;
    if (!connected) {
      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'NoInternetErrorScreen',
            }),
          ],
        }),
      );
    }
  });
};
