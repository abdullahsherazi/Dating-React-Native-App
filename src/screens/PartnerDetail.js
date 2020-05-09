import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Linking,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Loader from '../components/Loader';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import GlobalHeader from '../components/GlobalHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Entypo from 'react-native-vector-icons/Entypo';

class PartnerDetail extends React.Component {
  state = {
    navigationData: this.props.navigation.state.params.data,
    otherContactMethods: false,
    contactMethodsWithinApp: false,
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <GlobalHeader
          backArrow={true}
          headingText={'DETAIL'}
          twoWords={true}
          // drawerIcon={true}
          navigation={this.props.navigation}
        />
        <ScrollView style={{backgroundColor: 'white'}}>
          <View style={styles.ProfileNameView}>
            <View style={[styles.ImageView, {overflow: 'hidden'}]}>
              <View
                style={[
                  styles.ImageViewInside,
                  {overflow: 'hidden', backgroundColor: '#d9d9d9'},
                ]}>
                <Image
                  source={{uri: this.state.navigationData.avatar}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={styles.ProfileNameView2}>
              <Text style={styles.ProfileNameView2Text}>
                {this.state.navigationData.name}
              </Text>
              <Text style={styles.ProfileNameView2Text}>
                {this.state.navigationData.emailAddress}
              </Text>
              <Text style={styles.ProfileNameView2Text}>
                {this.state.navigationData.gender}
              </Text>
              <Text style={styles.ProfileNameView2Text}>
                {this.state.navigationData.mobileNumber}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 10,
              width: '100%',
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderColor: '#f0f0f0',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons
                name="library-books"
                style={{marginLeft: 10, marginRight: 10}}
                size={20}
                color="black"
              />
              <Text
                style={
                  (styles.ProfileNameView2Text,
                  {fontWeight: 'bold', fontSize: 15})
                }>
                Introduction
              </Text>
            </View>
            <Text
              style={
                (styles.ProfileNameView2Text,
                {marginTop: 10, marginLeft: 12, marginRight: 10})
              }>
              {this.state.navigationData.introduction}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <TouchableOpacity
              style={{backgroundColor: 'black', padding: 8, borderRadius: 5}}
              onPress={() => this.setState({contactMethodsWithinApp: true})}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Contact Methods Within App
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor: 'black', padding: 8, borderRadius: 5}}
              onPress={() => this.setState({otherContactMethods: true})}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Other Contact Methods
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {this.state.otherContactMethods ? (
          <Animatable.View
            ref="searchResultView"
            duration={500}
            animation="fadeIn"
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <View
              style={{
                width: '50%',
                height: 100,
                alignSelf: 'center',
                borderRadius: 15,
                padding: 17,
                paddingTop: 15,
                justifyContent: 'space-around',
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{height: 20, width: 20, overflow: 'hidden'}}
                onPress={() =>
                  Linking.openURL(
                    'whatsapp://send?text=' +
                      'Hello Iam ' +
                      this.props.reduxState.userdata.name +
                      ' I found you on Dating App.' +
                      '&phone=' +
                      this.state.navigationData.mobileNumber,
                  )
                }>
                <Image
                  source={require('../../assets/images/whatsapp.png')}
                  style={{width: '100%', height: '100%'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{height: 20, width: 20, overflow: 'hidden'}}
                onPress={() =>
                  Linking.openURL(
                    `sms:${
                      this.state.navigationData.mobileNumber
                    }?body=Hello Iam ${
                      this.props.reduxState.userdata.name
                    } I found you on Dating App.`,
                  )
                }>
                <Image
                  source={require('../../assets/images/message.png')}
                  style={{width: '100%', height: '100%'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{height: 20, width: 20, overflow: 'hidden'}}
                onPress={() =>
                  Linking.openURL(
                    `tel:${this.state.navigationData.mobileNumber}`,
                  )
                }>
                <Image
                  source={require('../../assets/images/phone.png')}
                  style={{width: '100%', height: '100%'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', top: 5, right: 5}}
                onPress={() =>
                  this.setState({
                    otherContactMethods: false,
                  })
                }>
                <Entypo name="circle-with-cross" color="#08a4ff" size={20} />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ) : null}

        {this.state.contactMethodsWithinApp ? (
          <Animatable.View
            ref="searchResultView"
            duration={500}
            animation="fadeIn"
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <View
              style={{
                width: '50%',
                height: 100,
                alignSelf: 'center',
                borderRadius: 15,
                padding: 17,
                paddingTop: 15,
                justifyContent: 'space-around',
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  this.setState(
                    {
                      contactMethodsWithinApp: false,
                    },
                    () => {
                      if (this.state.navigationData.fcmToken === null) {
                        this.refs.toast.show(
                          "Can't Call, Dating App Is Not Currently In Use Of " +
                            this.state.navigationData.name,
                          1500,
                        );
                      } else {
                        this.props.navigation.navigate('Caller', {
                          data: this.state.navigationData,
                        });
                      }
                    },
                  );
                }}>
                <View style={{height: 20, width: 20, overflow: 'hidden'}}>
                  <Image
                    source={require('../../assets/images/videoCall.png')}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                <Text style={{fontWeight: 'bold', fontSize: 8}}>
                  Video Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', top: 5, right: 5}}
                onPress={() =>
                  this.setState({
                    contactMethodsWithinApp: false,
                  })
                }>
                <Entypo name="circle-with-cross" color="#08a4ff" size={20} />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ) : null}
        {this.props.reduxState.loading ? <Loader /> : null}
        <Toast
          ref="toast"
          style={{
            backgroundColor: 'black',
            justifyContent: 'center',
          }}
          position="center"
          positionValue={200}
          fadeInDuration={0}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{
            color: 'white',
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 'bold',
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  StarMainView: {
    height: 190,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    justifyContent: 'center',
  },
  rattingInside1: {
    flexDirection: 'row',
    width: '100%',
  },
  ratingTextView: {
    width: '15%',
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderWidth: 0,
    paddingRight: 2,
  },
  ProgressBarView: {
    height: 30,
    justifyContent: 'center',
    borderWidth: 0,
    paddingLeft: 13,
  },
  ProfileNameView: {
    flexDirection: 'row',
    height: 100,
    width: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  ImageView: {
    width: '23%',
    alignItems: 'center',
    paddingTop: 20,
  },
  ImageViewInside: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  ProfileNameView2: {
    justifyContent: 'center',
  },
  RatingNumberView1: {
    height: 50,
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  RatingNumberView1Content: {
    backgroundColor: 'white',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  TotalReviews: {
    width: '25%',
    color: '#b3b3b3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProfileNameView2Text: {
    color: '#4d4d4d',
    fontSize: 12,
    fontFamily: 'sans-serif-condensed',
  },
  MainViewDetailsReviews: {
    flexDirection: 'row',
    paddingBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  SecondImageview: {
    width: '18%',
    alignItems: 'center',
    marginTop: 10,
  },
  ImageViewContent: {
    height: 40,
    width: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  MainViewDetailsReviews2: {
    width: '82%',
    marginTop: 10,
  },
  MainViewDetailsReviews2Content: {
    flexDirection: 'row',
    width: '100%',
  },
  dateView: {
    width: '47%',
  },
  LastratingView: {
    width: '28%',
    justifyContent: 'center',
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
)(PartnerDetail);
