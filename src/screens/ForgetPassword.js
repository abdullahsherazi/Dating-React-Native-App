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

class ForgetPassword extends React.Component {
  state = {
    emailAddress: '',
    error: false,
    validEmail: false,
  };

  forgetPasswordEmail = () => {
    if (this.state.emailAddress === '') {
      this.setState({error: 'Kindly Fill All The Fields'});
    } else if (this.state.validEmail === false) {
      this.setState({error: 'Kindly Enter Correct Email'});
    } else {
      this.setState({error: false});
      let userdata = {
        emailAddress: this.state.emailAddress.trim(),
      };
      this.props.reduxActions.forgetPasswordEmail(
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
          headingText={'FORGET PASSWORD'}
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
          Forget Password
        </Text>
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
          submit={() => this.forgetPasswordEmail()}
        />

        {this.state.error ? (
          <Text style={{marginTop: 5, color: 'red', textAlign: 'center'}}>
            {this.state.error}
          </Text>
        ) : null}

        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              textTransform: 'capitalize',
              textAlign: 'center',
              fontFamily: 'sans-serif-condensed',
            }}>
            On Clicking the submit button, A temporary password will be send on
            your email and using that you can login in the app. And from edit
            profile screen you can change your password.
          </Text>
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

const mapStateToProps = state => ({
  reduxState: state.reducers,
});

const mapDispatchToProps = dispatch => ({
  reduxActions: bindActionCreators(reduxActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgetPassword);
