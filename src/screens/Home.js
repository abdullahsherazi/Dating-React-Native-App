import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import GloabalHeader from '../components/GlobalHeader';
import Loader from '../components/Loader';
import Toast from '../components/react-native-easy-toast';

class Home extends Component {
  state = {
    switchToggle: false,
  };
  switchtoggleFunc = () => {
    this.setState({switchToggle: !this.state.switchToggle});
  };
  activateLocation = () => {
    this.switchtoggleFunc();
    if (this.state.switchToggle === false) {
      this.props.reduxActions.activateLocation(
        this.props.navigation,
        this.props.reduxState.userdata,
        this.switchtoggleFunc,
        this.refs.toast,
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#08a4ff'}}>
        <GloabalHeader
          backArrow={false}
          headingText={'HOME'}
          twoWords={true}
          drawerIcon={true}
          navigation={this.props.navigation}
        />
        <View
          style={{
            width: '95%',
            flex: 1,
            backgroundColor: 'white',
            marginTop: 100,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: 45,
              borderWidth: 0,
              justifyContent: 'center',
              padding: 10,
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderWidth: 0,
                top: -80,
              }}>
              <View
                style={{
                  width: '120%',
                  height: '120%',
                  borderWidth: 1.5,
                  position: 'absolute',
                  borderRadius: 120,
                  alignSelf: 'center',
                  top: -10,
                  zIndex: -2,
                  borderColor: 'white',
                  opacity: 0.5,
                }}
              />
              <View
                style={{
                  width: '140%',
                  height: '140%',
                  borderWidth: 1.5,
                  position: 'absolute',
                  borderRadius: 140,
                  alignSelf: 'center',
                  top: -20,
                  zIndex: -2,
                  borderColor: 'white',
                  opacity: 0.2,
                }}
              />

              <View>
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 120,
                    backgroundColor: 'grey',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{
                      uri: this.props.reduxState.userdata.avatar,
                    }}
                    resizeMode="cover"
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.ProfileHeading}>
            {this.props.reduxState.userdata.name}
          </Text>

          <View style={styles.options}>
            {Object.keys(this.props.reduxState.userdata.location).length ===
            0 ? (
              <Text style={[styles.ServiceText, styles.green]}>
                Activate My Location
              </Text>
            ) : (
              <Text style={[styles.ServiceText, styles.green]}>
                Update My Location
              </Text>
            )}
            <SwitchToggle
              containerStyle={{
                width: 35,
                height: 20,
                borderRadius: 30,
                padding: 5,
              }}
              backgroundColorOn="green"
              backgroundColorOff="rgb(195, 202, 204)"
              circleStyle={{
                width: 15,
                height: 15,
                borderRadius: 27.5,
                backgroundColor: 'white',
              }}
              switchOn={this.state.switchToggle}
              onPress={this.activateLocation}
              circleColorOff="white"
              circleColorOn="white"
              duration={500}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              this.props.reduxActions.searchPartners(
                this.props.navigation,
                this.props.reduxState.userdata,
                this.refs.toast,
              )
            }
            style={styles.options}>
            <Text style={[styles.ServiceText, styles.green]}>
              Search Partners
            </Text>

            <MaterialCommunityIcons
              name={'account-search-outline'}
              style={styles.Icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.reduxActions.signout(this.props.navigation)
            }
            style={[{position: 'absolute', bottom: 20}, styles.options]}>
            <Text style={[styles.ServiceText, styles.green]}>Sign Out</Text>

            <MaterialCommunityIcons name={'logout'} style={styles.Icon} />
          </TouchableOpacity>
        </View>
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
  picker: {
    width: 130,
    height: 40,
    paddingLeft: 0,
    alignSelf: 'flex-start',
  },
  Icon: {
    width: 20,
    height: 23,
    marginRight: 5,
    fontSize: 20,
    color: 'rgb(195, 202, 205)',
  },
  ProfileHeading: {
    color: '#1f7aad',
    textAlign: 'center',
    margin: 10,
    fontSize: 20,
    fontWeight: '400',
  },

  ServiceText: {
    color: 'rgb(195, 202, 205)',
    fontSize: 20,
  },
  avatar: {
    width: 140,
    height: 120,
    marginTop: -60,
  },
  green: {
    color: '#52c6a2',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
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
)(Home);
