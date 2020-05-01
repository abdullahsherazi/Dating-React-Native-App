import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import GlobalButton from '../components/GlobalButton';
import Loader from '../components/Loader';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-crop-picker';
import RadioForm from 'react-native-simple-radio-button';
import {Textarea} from 'native-base';

class EditProfile extends React.Component {
  state = {
    name: this.props.reduxState.userdata.name,
    mobileNumber: this.props.reduxState.userdata.mobileNumber,
    gender: this.props.reduxState.userdata.gender,
    introduction: this.props.reduxState.userdata.introduction,
    radioProps: [
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
    ],
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffff'}}>
        <ScrollView>
          <GlobalHeader
            twoWords={true}
            backArrow={true}
            navigation={this.props.navigation}
            backgroundColor="white"
            headingText="Edit Profile"
          />

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              flexDirection: 'row',
              marginVertical: 10,
              flex: 1,
              justifyContent: 'center',
              paddingLeft: 20,
              paddingVertical: 12,
              backgroundColor: 'white',
              elevation: 4,
            }}>
            <View style={{width: '70%', justifyContent: 'center'}}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Image
                  source={require('../../assets/images/camera.png')}
                  style={{
                    tintColor: '#08a4ff',
                    width: 20,
                    height: 20,
                    borderWidth: 0,
                    tintColor: '#08a4ff',
                  }}
                  resizeMode="contain"
                />

                <Text
                  style={{
                    fontSize: 17,
                    color: '#08a4ff',
                    fontWeight: '500',
                    marginLeft: 15,
                    color: '#08a4ff',
                  }}>
                  Welcome
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  elevation: 4,
                  borderRadius: 10,
                  paddingVertical: 12,
                  width: '95%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  ImagePicker.openPicker({
                    // cropping: true,
                    compressImageQuality: 0.5,
                  })
                    .then(image => {
                      this.props.reduxActions.uploadProfilePic(
                        this.props.reduxState.userdata,
                        image,
                        this.refs.toast,
                      );
                    })
                    .catch(err => {
                      // console.log(err);
                    });
                }}>
                <Image
                  source={require('../../assets/images/camera.png')}
                  style={{
                    tintColor: '#08a4ff',
                    width: 20,
                    height: 20,
                    borderWidth: 0,
                  }}
                  resizeMode="contain"
                />

                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    fontWeight: '500',
                    marginLeft: 15,
                  }}>
                  Upload from gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  elevation: 3,
                  borderRadius: 10,
                  paddingVertical: 12,
                  width: '95%',
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  ImagePicker.openCamera({
                    cropping: true,
                    compressImageQuality: 0.5,
                  })
                    .then(image => {
                      this.props.reduxActions.uploadProfilePic(
                        this.props.reduxState.userdata,
                        image,
                        this.refs.toast,
                      );
                    })
                    .catch(err => {
                      // console.log(err);
                    });
                }}>
                <Image
                  source={require('../../assets/images/camera.png')}
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 0,
                    tintColor: '#08a4ff',
                  }}
                  resizeMode="contain"
                />

                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontWeight: '500',
                    marginLeft: 15,
                  }}>
                  Take a photo
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{width: '30%', justifyContent: 'center'}}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 70,
                  borderWidth: 0.5,
                  borderColor: '#dcdcdc',
                  overflow: 'hidden',
                }}>
                <Image
                  source={{uri: this.props.reduxState.userdata.avatar}}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
              marginVertical: 10,
              paddingVertical: 20,
              padding: 8,
              backgroundColor: 'white',
              elevation: 4,
            }}>
            <View
              style={{
                width: '100%',
                borderWidth: 0,
                alignItems: 'center',
                paddingLeft: 10,
                flexDirection: 'row',
              }}>
              <Image
                source={require('../../assets/images/user.png')}
                style={{
                  height: 15,
                  width: 15,
                  marginLeft: 10,
                  tintColor: '#08a4ff',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 16,
                  color: '#08a4ff',
                  fontWeight: 'bold',
                  marginLeft: 15,
                  color: '#08a4ff',
                }}>
                Your Information{' '}
              </Text>
            </View>
            <View
              style={{
                width: '88%',
                alignSelf: 'center',
                borderWidth: 0,
                paddingVertical: 10,
              }}>
              <TextInput
                placeholder="Full Name"
                style={{
                  paddingLeft: 10,
                  borderWidth: 1.5,
                  fontWeight: '200',
                  borderColor: '#74ccff',
                  borderRadius: 10,
                  height: 45,
                  paddingVertical: 5,
                  fontSize: 12,
                  paddingRight: 10,
                }}
                placeholderTextColor="#595959"
                onChangeText={name => this.setState({name})}
                value={this.state.name}
                multiline={true}
              />
              <TextInput
                placeholder="Email Address"
                style={{
                  color: '#08a4ff',
                  paddingLeft: 10,
                  borderWidth: 1.5,
                  marginTop: 7,
                  fontWeight: '200',
                  borderColor: '#74ccff',
                  borderRadius: 10,
                  height: 45,
                  fontSize: 12,
                  paddingVertical: 0,
                }}
                placeholderTextColor="#595959"
                value={this.props.reduxState.userdata.emailAddress}
                editable={false}
              />
              <TextInput
                placeholder="Mobile Number"
                style={{
                  paddingLeft: 10,
                  borderWidth: 1.5,
                  marginTop: 7,
                  fontWeight: '200',
                  borderColor: '#74ccff',
                  borderRadius: 10,
                  height: 45,
                  paddingVertical: 0,
                  fontSize: 12,
                }}
                keyboardType="phone-pad"
                onChangeText={mobileNumber => this.setState({mobileNumber})}
                value={this.state.mobileNumber}
                placeholderTextColor="#595959"
                maxLength={35}
              />
            </View>
            <View style={styles.radioView}>
              <RadioForm
                buttonColor="#074777"
                selectedButtonColor="black"
                buttonSize={12}
                buttonOuterSize={15}
                formHorizontal={true}
                radio_props={this.state.radioProps}
                initial={
                  this.props.reduxState.userdata.gender === 'male' ? 0 : 1
                }
                onPress={label => {
                  this.setState({gender: label});
                }}
                labelStyle={{marginRight: 40, fontSize: 18, color: 'black'}}
              />
            </View>
            <Text
              style={{
                textTransform: 'capitalize',
                color: 'red',
                fontSize: 15,
                textAlign: 'center',
                fontFamily: 'sans-serif-condensed',
              }}>
              Note: Email Can't be updated.
            </Text>
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
              marginVertical: 10,
              paddingVertical: 20,
              padding: 8,
              backgroundColor: 'white',
              elevation: 4,
            }}>
            <View
              style={{
                width: '100%',
                borderWidth: 0,
                alignItems: 'center',
                paddingLeft: 10,
                flexDirection: 'row',
              }}>
              <Image
                source={require('../../assets/images/user.png')}
                style={{
                  height: 15,
                  width: 15,
                  marginLeft: 10,
                  tintColor: '#08a4ff',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 16,
                  color: '#08a4ff',
                  fontWeight: 'bold',
                  marginLeft: 15,
                  color: '#08a4ff',
                }}>
                Your Introduction
              </Text>
            </View>
            <View
              style={{
                width: '88%',
                alignSelf: 'center',
                borderWidth: 0,
                paddingVertical: 10,
              }}>
              <Textarea
                rowSpan={10}
                style={{
                  paddingLeft: 10,
                  borderWidth: 1.5,
                  fontWeight: '200',
                  borderColor: '#74ccff',
                  borderRadius: 10,
                  paddingVertical: 5,
                  fontSize: 12,
                  paddingRight: 10,
                }}
                placeholder="Your Introduction"
                placeholderTextColor="#595959"
                onChangeText={introduction => this.setState({introduction})}
                value={this.state.introduction}
              />
            </View>
          </View>

          <GlobalButton
            text={'Save Changes'}
            EditImage={true}
            navigation={this.props.navigation}
            marginBottom={10}
            submit={() => {
              if (
                this.state.name !== this.props.reduxState.userdata.name ||
                this.state.mobileNumber !==
                  this.props.reduxState.userdata.mobileNumber ||
                this.state.gender !== this.props.reduxState.userdata.gender ||
                this.state.introduction !==
                  this.props.reduxState.userdata.introduction
              ) {
                let userdata = {
                  ...this.props.reduxState.userdata,
                  name: this.state.name,
                  gender: this.state.gender,
                  mobileNumber: this.state.mobileNumber,
                  introduction: this.state.introduction,
                };
                this.props.reduxActions.updateUserInformation(
                  userdata,
                  this.props.navigation,
                  this.refs.toast,
                );
              } else
                this.refs.toast.show(
                  'Kindly Update Any Of Your Information',
                  1500,
                );
            }}
          />
        </ScrollView>
        <Toast
          ref="toast"
          style={{
            backgroundColor: 'black',
            justifyContent: 'center',
            width: '90%',
            alignSelf: 'center',
          }}
          position="center"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{
            color: 'white',
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 'bold',
          }}
        />
        {this.props.reduxState.loading ? <Loader /> : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  radioView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  reduxState: state.reducers,
});

const mapDispatchToProps = dispatch => ({
  reduxActions: bindActionCreators(reduxActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfile);
