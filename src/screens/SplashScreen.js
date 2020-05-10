import React from 'react';
import {View, Animated, SafeAreaView} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import GlobalHeader from '../components/GlobalHeader';

class SplashScreen extends React.Component {
  constructor() {
    super();
    this.springValue = new Animated.Value(0.4);
  }
  componentDidMount() {
    this.spring();
    let timeOutNavigate = setTimeout(() => {
      this.props.reduxActions.internetListener(
        this.props.navigation,
        this.checkUser,
      );
      clearTimeout(timeOutNavigate);
    }, 3000);
  }
  checkUser = () => {
    this.props.reduxActions.checkUser(
      this.props.navigation,
      this.props.reduxState.call,
    );
  };
  spring() {
    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 1,
      useNativeDriver: true,
    }).start();
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#08a4ff'}}>
        <GlobalHeader />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Animated.Image
            style={{
              width: 100,
              height: 100,
              transform: [{scale: this.springValue}],
            }}
            source={require('../../assets/images/relationship.png')}
          />
        </View>
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
)(SplashScreen);
