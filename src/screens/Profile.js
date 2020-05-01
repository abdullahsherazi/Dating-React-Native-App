import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import GloabalHeader from '../components/GlobalHeader';
import GlobalButton from '../components/GlobalButton';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class Profile extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffff'}}>
        <ScrollView>
          <GloabalHeader
            twoWords={true}
            backArrow={true}
            navigation={this.props.navigation}
            backgroundColor="white"
            headingText="Profile"
          />

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              flexDirection: 'row',
              marginVertical: 10,
              flex: 1,
              elevation: 5,
              backgroundColor: 'white',
              opacity: 30,
              justifyContent: 'center',
              paddingLeft: 20,
              paddingVertical: 12,
            }}>
            <View style={{width: '70%', justifyContent: 'center'}}>
              <Text style={{fontSize: 17, color: '#a6a6a6'}}>Welcome </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: '#61b1ff',
                  textTransform: 'capitalize',
                  fontFamily: 'sans-serif-condensed',
                }}>
                {this.props.reduxState.userdata.name}
              </Text>
            </View>
            <View style={{width: '30%'}}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 70,
                  borderWidth: 0.5,
                  borderColor: '#dcdcdc',
                  overflow: 'hidden',
                  backgroundColor: '#d9d9d9',
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
              paddingVertical: 15,
              overflow: 'hidden',
              flexDirection: 'row',
              elevation: 5,
              backgroundColor: 'white',
            }}>
            <View
              style={{
                width: '20%',
                borderWidth: 0,
                alignItems: 'center',
                paddingLeft: 10,
              }}>
              <Image
                source={require('../../assets/images/user.png')}
                style={{height: 20, width: 20, marginTop: 5}}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: '80%',
                borderWidth: 0,
                paddingLeft: 0,
                justifyContent: 'center',
                paddingRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#08a4ff',
                  marginVertical: 5,
                  fontWeight: 'bold',
                }}>
                Your Information
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#585858',
                  marginTop: 2,
                }}>
                {this.props.reduxState.userdata.name}
              </Text>
              <View style={{paddingVertical: 0}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#6b6b6b',
                    borderWidth: 0,
                  }}>
                  {this.props.reduxState.userdata.emailAddress}
                </Text>
              </View>
              <View style={{paddingVertical: 2}}>
                <Text style={{fontSize: 14, color: '#6b6b6b'}}>
                  {this.props.reduxState.userdata.gender}
                </Text>
              </View>
              <View style={{paddingVertical: 0}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#6b6b6b',
                    borderWidth: 0,
                  }}>
                  {this.props.reduxState.userdata.mobileNumber}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
              marginVertical: 10,
              paddingVertical: 15,
              overflow: 'hidden',
              flexDirection: 'row',
              elevation: 5,
              backgroundColor: 'white',
            }}>
            <View
              style={{
                width: '20%',
                borderWidth: 0,
                alignItems: 'center',
                paddingLeft: 10,
              }}>
              <MaterialCommunityIcons
                name="library-books"
                style={{marginTop: 5}}
                size={20}
                color="#08a4ff"
              />
            </View>
            <View
              style={{
                width: '80%',
                borderWidth: 0,
                paddingLeft: 0,
                justifyContent: 'center',
                paddingRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#08a4ff',
                  marginVertical: 5,
                  fontWeight: 'bold',
                }}>
                Your Introduction
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#585858',
                  marginTop: 2,
                }}>
                {this.props.reduxState.userdata.introduction}
              </Text>
            </View>
          </View>

          <GlobalButton
            text={' Edit Profile'}
            EditImage={true}
            submit={() => this.props.navigation.navigate('EditProfile')}
            navigation={this.props.navigation}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  reduxState: state.reducers,
});

const mapDispatchToProps = dispatch => ({
  reduxActions: bindActionCreators(reduxActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
