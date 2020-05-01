import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import GlobalHeader from '../components/GlobalHeader';
import GlobalButton from '../components/GlobalButton';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';

class PartnersListCarousel extends Component {
  renderItem(item, index, navigation) {
    return (
      <View
        style={[
          styles.item,
          {
            backgroundColor: 'black',
          },
        ]}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            overflow: 'hidden',
            alignSelf: 'center',
            backgroundColor: '#d9d9d9',
          }}>
          <Image
            source={{
              uri: item.avatar,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            fontSize: 15,
            alignSelf: 'center',
            color: 'white',
            fontFamily: 'sans-serif-condensed',
            textTransform: 'capitalize',
            fontWeight: 'bold',
            marginTop: 5,
          }}>
          {item.name}
        </Text>

        <Text
          style={{
            fontSize: 15,
            alignSelf: 'center',
            color: 'white',
            fontFamily: 'sans-serif-condensed',
            textTransform: 'capitalize',
            fontWeight: 'bold',
            marginTop: 5,
          }}>
          {item.mobileNumber}
        </Text>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <GlobalButton
            marginTop={5}
            marginTop={30}
            marginBottom={10}
            borderRadius={30}
            width={'90%'}
            text={'DETAILS'}
            textColor="white"
            fontWeight="bold"
            loading={this.props.reduxState.loading}
            borderWidth={this.props.reduxState.loading ? 1 : 0}
            height={40}
            submit={() =>
              navigation.navigate('PartnerDetail', {
                data: item,
                index: index,
              })
            }
          />
        </View>
      </View>
    );
  }

  render() {
    const screenWidth = Dimensions.get('window').width;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#08a4ff'}}>
        <GlobalHeader
          backArrow={true}
          headingText={'PARTNERS'}
          twoWords={true}
          // drawerIcon={true}
          navigation={this.props.navigation}
        />
        <View style={{flex: 1}}>
          <View style={styles.carousel}>
            <Carousel
              data={this.props.reduxState.partners}
              renderItem={({item, index}) => {
                return this.renderItem(item, index, this.props.navigation);
              }}
              sliderWidth={screenWidth}
              itemWidth={screenWidth * 0.75}
            />
          </View>
        </View>
        <Toast
          ref="toast"
          style={{
            backgroundColor: 'white',
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
            color: 'black',
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
  mainView: {
    width: '100%',
    height: '100%',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    paddingTop: 9,
    marginTop: 4,
    paddingTop: 8,
    flexDirection: 'row',
  },
  arrowLeft: {
    height: 18,
    width: 10,
    color: '#839DA7',
  },
  hLabel: {
    color: '#839DA7',
    marginLeft: 20,
    fontSize: 17,
  },
  carousel: {
    marginTop: '20%',
    height: '82%',
  },
  item: {
    width: '100%',
    height: 350,
    margin: 5,
    alignSelf: 'center',
    borderRadius: 8,
    padding: 12,
  },

  Text: {
    color: '#839DA7',
    textAlign: 'center',
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
)(PartnersListCarousel);
