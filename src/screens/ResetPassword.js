import React from 'react';
import {
  Image,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Loader from '../components/Loader';
import GlobalHeader from '../components/GlobalHeader';
import GlobalButton from '../components/GlobalButton';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import GlobalInput from '../components/GlobalInput';

class ResetPassword extends React.Component {
  state = {
    password: '',
    error: false,
  };

  resetPassword = () => {
    if (this.state.password === '') {
      this.setState({error: 'Kindly Enter New Password'});
    } else if (this.state.password.length < 8) {
      this.setState({error: 'Password length should be 8 or greater!'});
    } else {
      this.setState({error: false});
      let userdata = {
        ...this.props.reduxState.userdata,
        password: this.state.password.trim(),
      };
      this.props.reduxActions.resetPassword(
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
          backArrow={true}
          headingText={'RESET PASSWORD'}
          threeWords={true}
          navigation={this.props.navigation}
        />

        <View
          style={{
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 30,
            width: '100%',
          }}>
          <Image
            source={require('../../assets/images/relationship.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 28,
            color: 'black',
            paddingVertical: 23,
            fontFamily: 'sans-serif-condensed',
          }}>
          Reset Password
        </Text>
        <GlobalInput
          borderColor="black"
          password={true}
          marginTop={10}
          borderRadius={20}
          placeholder="New Password"
          changeText={password => this.setState({password})}
          secureTextEntry={true}
        />
        <GlobalButton
          backgroundColor="#1cabff"
          marginTop={10}
          marginBottom={10}
          borderRadius={20}
          width={'90%'}
          text={'Submit'}
          textColor="white"
          fontWeight="bold"
          loading={this.props.reduxState.loading}
          submit={() => this.resetPassword()}
        />

        {this.state.error ? (
          <Text style={{marginTop: 5, color: 'red', textAlign: 'center'}}>
            {this.state.error}
          </Text>
        ) : null}

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
)(ResetPassword);
