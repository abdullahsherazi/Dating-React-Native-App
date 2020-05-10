import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import server from '../constants/server';
import io from 'socket.io-client';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import {Header, Body, Left, Right} from 'native-base';
import {NavigationActions, StackActions} from 'react-navigation';
import Sound from 'react-native-sound';

const dimensions = Dimensions.get('window');
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-crop-picker';
import RadioForm from 'react-native-simple-radio-button';
import {Textarea} from 'native-base';
import axios from 'axios';
import GlobalHeader from '../components/GlobalHeader';
import GlobalButton from '../components/GlobalButton';
import Loader from '../components/Loader';

class RecieverVideoCallScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: null,
      remoteStream: null,
      recieverSocketId: null,
      callerSocketId: null,
      loading: true,
      loadingDescription: 'Connecting To Server',
      calling: false,
      properEndCall: false,
      componentWillUnmountShouldRun: true,
    };

    this.sdp;
    this.socket = null;
    this.candidates = [];
    this.connectingtimeOut = null;
    this.whoosh = null;
  }
  componentWillUnmount() {
    if (
      this.state.properEndCall === false &&
      this.state.componentWillUnmountShouldRun === true
    ) {
      if (this.connectingtimeOut !== null) {
        clearTimeout(this.connectingtimeOut);
      }
      this.closeCall();
    }
  }
  componentDidMount = () => {
    this.setState({
      localStream: null,
      remoteStream: null,
      recieverSocketId: null,
      callerSocketId: null,
      loading: true,
      loadingDescription: 'Connecting To Server',
      calling: false,
    });
    this.sdp;
    this.socket = null;
    this.candidates = [];
    this.connectingtimeOut = null;
    this.props.reduxActions.setCallStatus(true);
    this.whoosh = null;

    this.socket = io.connect(server, {
      path: '/io/webrtc',
      query: {},
    });

    this.socket.on('connection-success', socket => {
      this.setState({
        recieverSocketId: socket.socketId,
        callerSocketId: this.props.navigation.state.params.data.callerSocketId,
      });
      this.socket.emit('recieverCallResponse', {
        caller: false,
        recieverSocketId: socket.socketId,
        callerSocketId: this.props.navigation.state.params.data.callerSocketId,
      });

      this.connectingtimeOut = setTimeout(() => {
        this.setState({
          loadingDescription: 'No Response From Caller',
        });
        let timeOutNavigate = setTimeout(() => {
          this.closeCall();
          clearTimeout(timeOutNavigate);
        }, 500);
        clearTimeout(this.connectingtimeOut);
      }, 20000);
    });

    this.socket.on('offerOrAnswer', payload => {
      clearTimeout(this.connectingtimeOut);
      this.setState({
        loadingDescription:
          this.props.navigation.state.params.data.caller.name + ' is calling',
        calling: true,
      });
      this.sdp = JSON.stringify(payload.sdp);
      this.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      this.whoosh = new Sound('ringing.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          return;
        }
        this.whoosh.play();
        this.whoosh.setNumberOfLoops(-1);
      });
    });

    this.socket.on('endCall', () => {
      this.setState(
        {
          loading: true,
          loadingDescription:
            'Call Has Been Ended By ' +
            this.props.navigation.state.params.data.caller.name,
          properEndCall: true,
        },
        () => {
          let timeOutNavigate = setTimeout(() => {
            this.closeCall();
            clearTimeout(timeOutNavigate);
          }, 500);
        },
      );
    });
    this.socket.on('socketDisconnected', () => {
      if (this.state.properEndCall === false) {
        this.setState(
          {
            loading: true,
            loadingDescription: 'Some Problem Occured At Caller End',
            componentWillUnmountShouldRun: false,
          },
          () => {
            let timeOutNavigate = setTimeout(() => {
              this.closeCall();
              clearTimeout(timeOutNavigate);
            }, 500);
          },
        );
      }
    });
    this.socket.on('candidate', candidate => {
      // console.log('From Peer... ', JSON.stringify(candidate))
      // this.candidates = [...this.candidates, candidate]
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    const pc_config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };

    this.pc = new RTCPeerConnection(pc_config);

    this.pc.onicecandidate = e => {
      // send the candidates to the remote peer
      // see addCandidate below to be triggered on the remote peer
      if (e.candidate) {
        // console.log(JSON.stringify(e.candidate))
        this.sendToPeer('candidate', {
          recieverSocketId: this.state.recieverSocketId,
          callerSocketId: this.state.callerSocketId,
          candidate: e.candidate,
          caller: false,
        });
        // this.sendToPeer('candidate', e.candidate);
      }
    };

    // triggered when there is a change in connection state
    this.pc.oniceconnectionstatechange = e => {
      // console.log(e);
    };

    this.pc.onaddstream = e => {
      debugger;
      // this.remoteVideoref.current.srcObject = e.streams[0]
      this.setState({
        remoteStream: e.stream,
      });
    };

    const success = stream => {
      // console.log(stream.toURL());
      this.setState({
        localStream: stream,
      });
      this.pc.addStream(stream);
    };

    const failure = e => {
      this.setState({
        loadingDescription:
          'Some Problem Occured In Getting Hold On Your Media Devices',
        componentWillUnmountShouldRun: false,
      });
      let timeOutNavigate = setTimeout(() => {
        this.closeCall();
        clearTimeout(timeOutNavigate);
      }, 500);
    };

    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: isFront ? 'user' : 'environment',
          optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      };

      mediaDevices
        .getUserMedia(constraints)
        .then(success)
        .catch(failure);
    });
  };

  sendToPeer = (messageType, payload) => {
    this.socket.emit(messageType, payload);
  };
  closeCall = () => {
    if (this.whoosh !== null) {
      this.whoosh.stop();
    }
    this.props.reduxActions.setCallStatus(false);
    this.socket.disconnect();
    this.pc.close();
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
          }),
        ],
      }),
    );
  };
  createAnswer = () => {
    this.pc
      .createAnswer({offerToReceiveVideo: 1})
      .then(sdp => {
        this.pc.setLocalDescription(sdp);
        this.sendToPeer('offerOrAnswer', {
          recieverSocketId: this.state.recieverSocketId,
          callerSocketId: this.state.callerSocketId,
          sdp,
          caller: false,
        });
        this.whoosh.stop();
        this.setState({
          loading: false,
          loadingDescription: '',
          calling: false,
        });
      })
      .catch(() => {
        this.setState({
          loadingDescription: 'Some Problem Occured While Answering To Call',
          componentWillUnmountShouldRun: false,
        });
        let timeOutNavigate = setTimeout(() => {
          this.closeCall();
          clearTimeout(timeOutNavigate);
        }, 500);
      });
  };

  render() {
    const {localStream, remoteStream} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffff'}}>
        <Header
          style={{
            backgroundColor: 'transparent',
            elevation: 0,
          }}>
          <Left style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 30,
                backgroundColor: 'grey',
                marginLeft: 20,
              }}>
              <Image
                source={{
                  uri: this.props.navigation.state.params.data.caller.avatar,
                }}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
            <Text style={{fontWeight: 'bold', marginLeft: 10}}>
              {this.props.navigation.state.params.data.caller.name}
            </Text>
          </Left>
        </Header>
        {this.state.loading ? (
          <View
            style={{
              flex: 1,
              backgroundColor: 'black',
              opacity: 0.8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                {this.state.loadingDescription}
              </Text>
            </View>

            {this.state.calling === true ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={{height: 40, width: 40, marginRight: 20}}
                  onPress={() => this.createAnswer()}>
                  <Image
                    source={require('../../assets/images/answerCall.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{height: 50, width: 50}}
                  onPress={() => {
                    this.socket.emit('cancelCall', {
                      recieverSocketId: this.state.recieverSocketId,
                      callerSocketId: this.state.callerSocketId,
                      caller: false,
                    });
                    this.setState({
                      calling: false,
                    });
                    this.closeCall();
                  }}>
                  <Image
                    source={require('../../assets/images/endCall.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                width: '100%',
                height: 200,
                marginVertical: 10,
              }}>
              <View
                style={{
                  height: 200,
                  width: 200,
                  borderRadius: 200,
                  position: 'absolute',
                  right: 20,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'black',
                }}>
                <RTCView
                  key={1}
                  zOrder={0}
                  objectFit="cover"
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  streamURL={localStream && localStream.toURL()}
                  // streamURL={this.state.localStream.toURL()}
                />
              </View>
            </View>
            <RTCView
              key={1}
              zOrder={0}
              objectFit="cover"
              style={{width: '90%', height: '100%', alignSelf: 'center'}}
              streamURL={remoteStream && remoteStream.toURL()}
              // streamURL={this.state.remoteStream.toURL()}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{height: 40, width: 40, marginRight: 20}}
                onPress={() => localStream._tracks[1]._switchCamera()}>
                <Image
                  source={require('../../assets/images/cameraRotate.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    tintColor: 'white',
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{height: 50, width: 50}}
                onPress={() => {
                  this.socket.emit('endCall', {
                    recieverSocketId: this.state.recieverSocketId,
                    callerSocketId: this.state.callerSocketId,
                    caller: false,
                  });
                  this.whoosh.stop();
                  this.closeCall();
                }}>
                <Image
                  source={require('../../assets/images/endCall.png')}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
)(RecieverVideoCallScreen);
