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
import axios from 'axios';
import server from '../constants/server';
import io from 'socket.io-client';
import {Header, Body, Left, Right} from 'native-base';
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
import Sound from 'react-native-sound';

const dimensions = Dimensions.get('window');
import GlobalHeader from '../components/GlobalHeader';
import GlobalButton from '../components/GlobalButton';
import Loader from '../components/Loader';
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-crop-picker';
import RadioForm from 'react-native-simple-radio-button';
import {Textarea} from 'native-base';
import * as Animatable from 'react-native-animatable';

class CallerVideoCallScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localStream: null,
      remoteStream: null,
      recieverSocketId: null,
      callerSocketId: null,
      loading: true,
      loadingDescription: 'Connecting To Server',
      properEndCall: false,
      componentWillUnmountShouldRun: true,
    };

    this.sdp;
    this.socket = null;
    this.candidates = [];
    this.whoosh = null;
    this.connectingtimeOut = null;
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
      connecting: true,
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
      let data = {
        ...this.props.navigation.state.params.data,
        socketId: socket.socketId,
        caller: {
          name: this.props.reduxState.userdata.name,
          avatar: this.props.reduxState.userdata.avatar,
        },
        videoCall: 'YES',
      };
      axios
        .post(server + 'users/callNotification', data, {
          headers: {
            'x-access-token': this.props.reduxState.userdata.token,
          },
        })
        .then(response => {
          if (response.status === 200) {
            this.setState({
              loadingDescription: 'Calling',
            });

            this.whoosh = new Sound('calling.mp3', Sound.MAIN_BUNDLE, error => {
              if (error) {
                return;
              }
              this.whoosh.play();
              this.whoosh.setNumberOfLoops(-1);
            });

            this.connectingtimeOut = setTimeout(() => {
              this.setState({
                loadingDescription: 'No Response From Reciever',
              });
              let timeOutNavigate = setTimeout(() => {
                this.closeCall();
                clearTimeout(timeOutNavigate);
              }, 500);
              clearTimeout(this.connectingtimeOut);
            }, 60000);
          } else {
            this.setState({
              loadingDescription:
                'Some Problem Occured In Connecting To ' +
                this.props.navigation.state.params.data.name,
              componentWillUnmountShouldRun: false,
            });
            let timeOutNavigate = setTimeout(() => {
              this.props.reduxActions.setCallStatus(false);
              this.socket.disconnect();
              this.pc.close();
              this.props.navigation.goBack();
              clearTimeout(timeOutNavigate);
            }, 500);
          }
        })
        .catch(() => {
          this.setState({
            loadingDescription:
              'Some Problem Occured In Connecting To ' +
              this.props.navigation.state.params.data.name,
            componentWillUnmountShouldRun: false,
          });
          let timeOutNavigate = setTimeout(() => {
            this.props.reduxActions.setCallStatus(false);
            this.socket.disconnect();
            this.pc.close();
            this.props.navigation.goBack();
            clearTimeout(timeOutNavigate);
          }, 500);
        });
    });

    this.socket.on('recieverCallResponse', payload => {
      clearTimeout(this.connectingtimeOut);
      this.setState({
        recieverSocketId: payload.recieverSocketId,
        callerSocketId: payload.callerSocketId,
        connecting: false,
      });
      this.createOffer(payload);
    });

    this.socket.on('offerOrAnswer', payload => {
      this.sdp = JSON.stringify(payload.sdp);
      this.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      this.setState({
        loading: false,
        loadingDescription: '',
      });
      this.whoosh.stop();
    });

    this.socket.on('endCall', () => {
      this.setState(
        {
          loading: true,
          loadingDescription:
            'Call Has Been Ended By ' +
            this.props.navigation.state.params.data.name,
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
    this.socket.on('cancelCall', () => {
      this.setState(
        {
          loading: true,
          loadingDescription:
            'Call Has Been Cancelled By ' +
            this.props.navigation.state.params.data.name,
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
            loadingDescription: 'Some Problem Occured At Reciever End',
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
          caller: true,
        });
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
  closeCall = () => {
    if (this.whoosh !== null) {
      this.whoosh.stop();
    }
    this.props.reduxActions.setCallStatus(false);
    this.socket.disconnect();
    this.pc.close();
    this.props.navigation.goBack();
  };

  sendToPeer = (messageType, payload) => {
    this.socket.emit(messageType, payload);
  };

  createOffer = payload => {
    this.pc
      .createOffer({offerToReceiveVideo: 1})
      .then(sdp => {
        this.setState({
          loadingDescription: 'Ringing',
        });
        this.pc.setLocalDescription(sdp);
        this.sendToPeer('offerOrAnswer', {...payload, sdp, caller: true});
      })
      .catch(() => {
        this.setState({
          loadingDescription:
            'Some Problem Occured While Calling To ' +
            this.props.navigation.state.params.data.name,
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
                source={{uri: this.props.navigation.state.params.data.avatar}}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            </View>
            <Text style={{fontWeight: 'bold', marginLeft: 10}}>
              {this.props.navigation.state.params.data.name}
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
                style={{height: 50, width: 50}}
                onPress={() => {
                  this.socket.emit('endCall', {
                    recieverSocketId: this.state.recieverSocketId,
                    callerSocketId: this.state.callerSocketId,
                    caller: true,
                  });
                  if (this.whoosh !== null) {
                    this.whoosh.stop();
                  }
                  this.props.reduxActions.setCallStatus(false);
                  this.socket.disconnect();
                  this.pc.close();
                  this.props.navigation.goBack();
                }}>
                <Image
                  source={require('../../assets/images/endCall.png')}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
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
              style={{
                width: '90%',
                height: '100%',
                alignSelf: 'center',
              }}
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
                    caller: true,
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
)(CallerVideoCallScreen);
