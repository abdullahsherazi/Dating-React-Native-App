import React from 'react';
import {
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Loader from '../components/Loader';
import GlobalHeader from '../components/GlobalHeader';
import GlobalInput from '../components/GlobalInput';
import GlobalButton from '../components/GlobalButton';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import Toast from '../components/react-native-easy-toast';

class SignIn extends React.Component {
  state = {
    emailAddress: '',
    password: '',
    error: false,
    validEmail: false,
  };

  signin = () => {
    if (this.state.emailAddress === '' || this.state.password === '') {
      this.setState({error: 'Kindly Fill All The Fields'});
    } else if (this.state.validEmail === false) {
      this.setState({error: 'Kindly Enter Correct Email'});
    } else if (this.state.password.length < 8) {
      this.setState({error: 'Password length should be 8 or greater!'});
    } else {
      this.setState({error: false});
      let userdata = {
        emailAddress: this.state.emailAddress.trim(),
        password: this.state.password.trim(),
      };
      this.props.reduxActions.signin(
        this.props.navigation,
        userdata,
        this.refs.toast,
      );
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <GlobalHeader
          // backArrow={true}
          headingText={'SIGNIN'}
          navigation={this.props.navigation}
        />
        <ScrollView>
          <View
            style={{
              marginTop: 40,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 30,
              overflow: 'hidden',
            }}>
            <Image
              source={require('../../assets/images/relationship.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>

          <GlobalInput
            borderColor="black"
            emailAddress={true}
            placeholder="Email Address"
            borderRadius={20}
            changeText={email => {
              const emailCheckRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
              this.setState({emailAddress: email});
              if (emailCheckRegex.test(String(email)) === true) {
                this.setState({validEmail: true});
              } else if (emailCheckRegex.test(String(email)) === false) {
                this.setState({validEmail: false});
              }
            }}
          />
          <GlobalInput
            borderColor="black"
            password={true}
            marginTop={10}
            borderRadius={20}
            placeholder="Password"
            changeText={password => this.setState({password})}
            secureTextEntry={true}
          />

          <GlobalButton
            backgroundColor="#1cabff"
            marginTop={10}
            marginBottom={10}
            borderRadius={20}
            width={'90%'}
            text={'SignIn'}
            textColor="white"
            fontWeight="bold"
            submit={() => this.signin()}
          />

          {this.state.error ? (
            <Text style={{marginTop: 5, color: 'red', textAlign: 'center'}}>
              {this.state.error}
            </Text>
          ) : null}
          <View
            style={{
              width: '90%',
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
              }}>
              New User?
            </Text>
            <Text
              style={{
                color: '#1cabff',
                fontSize: 16,
                marginLeft: 4,
                fontWeight: 'bold',
              }}
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}>
              SignUp
            </Text>
          </View>

          {/* <View
            style={{
              width: '90%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
              }}>
              Forget Password?
            </Text>
            <Text
              style={{
                color: '#1cabff',
                fontSize: 16,
                marginLeft: 4,
                fontWeight: 'bold',
              }}
              onPress={() => {
                this.props.navigation.navigate('ForgetPassword');
              }}>
              Reset Your Password
            </Text>
          </View>
         */}
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

const mapStateToProps = state => ({
  reduxState: state.reducers,
});

const mapDispatchToProps = dispatch => ({
  reduxActions: bindActionCreators(reduxActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
