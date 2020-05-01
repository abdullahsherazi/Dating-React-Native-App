import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Foundation from 'react-native-vector-icons/dist/Foundation';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

class DrawerView extends React.Component {
  state = {
    switchValue: true,
  };
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: '#08a4ff',
          },
        ]}>
        <View style={[styles.View1]}>
          <View style={styles.ProfilePic}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 90,
                borderWidth: 0.5,
                borderColor: '#bfbfbf',
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

          <View
            style={{
              width: '55%',
              height: '100%',
              justifyContent: 'center',
              paddingLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                fontFamily: 'sans-serif-condensed',
                textTransform: 'capitalize',
              }}>
              {this.props.reduxState.userdata.name}
            </Text>

            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  paddingVertical: 5,
                  fontFamily: 'sans-serif-condensed',
                }}
                onPress={() => {
                  this.props.hideDrawer();
                  this.props.navigation.navigate('Profile');
                }}>
                View Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ContentView}
          onPress={() => {
            this.props.hideDrawer();
            this.props.navigation.navigate('HomeScreen');
          }}>
          <View style={styles.ContentViewInside1}>
            <Image
              source={require('../../assets/images/homeblue.png')}
              style={{
                width: '60%',
                height: '50%',
                marginLeft: 5,
                tintColor: 'black',
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.ContentViewInside2}>
            <Text
              style={[
                styles.ContentViewText,
                {color: 'black', fontWeight: 'bold'},
              ]}>
              {' '}
              Home
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  View1: {
    height: 156,
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  ProfilePic: {
    height: '100%',
    // borderRadius: 100,
    paddingRight: 5,

    borderWidth: 0,
    borderColor: '#81d0ff',
    width: '45%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  ContentView: {
    paddingLeft: 15,
    height: 30,
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  ContentViewInside1: {
    width: '15%',
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderBottomColor: '#796a3f',
  },
  ContentViewInside2: {
    paddingLeft: 0,
    width: '85%',
    borderBottomWidth: 0,
    borderBottomColor: '#796a3f',
    justifyContent: 'center',
  },
  ContentViewText: {
    color: '#4e3b00',
    fontSize: 16,
  },
  Notification: {
    paddingLeft: 15,
    height: 50,
    flexDirection: 'row',
    width: '100%',
  },
  NotificationInside1: {
    width: '15%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#796a3f',
  },
  NotificationInside2: {
    paddingLeft: 0,
    width: '60%',
    borderBottomWidth: 1,
    borderBottomColor: '#796a3f',
    justifyContent: 'center',
  },
  NotificationInside3: {
    width: '25%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#796a3f',
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
)(DrawerView);
