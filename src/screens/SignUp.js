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
import RadioForm from 'react-native-simple-radio-button';
import CountryPicker from 'react-native-country-picker-modal';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import {Textarea} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class SignUp extends React.Component {
  state = {
    name: '',
    emailAddress: '',
    password: '',
    error: false,
    validEmail: false,
    radioProps: [
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
    ],
    countryModel: false,
    countryCode: '+92',
    number: '',
    mobileNumber: '',
    gender: 'male',
    introduction: '',
  };

  signup = () => {
    if (
      this.state.emailAddress === '' ||
      this.state.password === '' ||
      this.state.number === '' ||
      this.state.name === '' ||
      this.state.introduction === ''
    ) {
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
        mobileNumber: this.state.countryCode + this.state.number,
        gender: this.state.gender,
        name: this.state.name,
        introduction: this.state.introduction,
      };
      this.props.reduxActions.signup(
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
          headingText={'SIGNUP'}
          navigation={this.props.navigation}
        />
        <ScrollView>
          <View
            style={{
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
          <View style={styles.radioView}>
            <RadioForm
              buttonColor="#074777"
              selectedButtonColor="black"
              buttonSize={12}
              buttonOuterSize={15}
              formHorizontal={true}
              // labelHorizontal={true}
              radio_props={this.state.radioProps}
              style={{alignSelf: 'center'}}
              initial={0}
              onPress={label => {
                this.setState({gender: label});
              }}
              labelStyle={{marginRight: 40, fontSize: 18, color: 'black'}}
            />
          </View>

          <GlobalInput
            person={true}
            borderColor="black"
            marginTop={10}
            borderRadius={20}
            placeholder="Full Name"
            changeText={name => this.setState({name})}
          />
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

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              width: '90%',
              height: 40,
              marginTop: 10,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'black',
            }}>
            <MaterialIcons
              name="smartphone"
              style={{marginLeft: 10, marginTop: 10}}
              size={20}
              color="black"
            />
            <TouchableOpacity
              style={{
                height: '100%',
                justifyContent: 'center',
                marginLeft: 5,
              }}
              onPress={() => this.setState({countryModel: true})}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                {this.state.countryCode}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={{
                flex: 1,
                padding: 10,
                paddingRight: 10,
                fontSize: 10,
                height: '100%',
              }}
              keyboardType="number-pad"
              placeholderTextColor="black"
              onChangeText={number => {
                this.setState({number: number});
              }}
              value={this.state.number}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              width: '90%',
              height: 150,
              marginTop: 10,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'black',
            }}>
            <MaterialCommunityIcons
              name="library-books"
              style={{marginLeft: 10, marginTop: 10}}
              size={20}
              color="black"
            />
            <Textarea
              rowSpan={10}
              style={{
                flex: 1,
                padding: 10,
                paddingRight: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                fontSize: 10,
              }}
              placeholder="Your Introduction"
              placeholderTextColor="black"
              onChangeText={introduction => {
                this.setState({introduction: introduction});
              }}
              value={this.state.introduction}
            />
          </View>
          {this.state.error ? (
            <Text
              style={{
                marginTop: 5,
                color: 'red',
                textAlign: 'center',
                fontSize: 10,
              }}>
              {this.state.error}
            </Text>
          ) : null}

          <GlobalButton
            backgroundColor="#1cabff"
            marginTop={10}
            marginBottom={10}
            borderRadius={20}
            width={'90%'}
            text={'SignUp'}
            textColor="white"
            fontWeight="bold"
            submit={() => this.signup()}
          />
        </ScrollView>

        {this.state.countryModel ? (
          <CountryPicker
            withFilter={true}
            withFlag={true}
            withCountryNameButton={true}
            withAlphaFilter={true}
            withCallingCode={true}
            withEmoji={true}
            onSelect={true}
            visible={true}
            onClose={() => {
              this.setState({countryModel: false});
            }}
            onSelect={country => {
              this.setState({
                countryModel: false,
                countryCode: '+' + country.callingCode,
              });
            }}
          />
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
const styles = StyleSheet.create({
  radioView: {
    width: '100%',
    height: 30,
    borderWidth: 0,
    padding: 5,
    marginTop: 25,
    marginBottom: 5,
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
)(SignUp);
