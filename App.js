/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

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

import io from 'socket.io-client';

const dimensions = Dimensions.get('window');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: null,
      remoteStream: null,
    };

    this.sdp;
    this.socket = null;
    this.candidates = [];
  }

  componentDidMount = () => {
    this.socket = io.connect('https://8aa7a006.ngrok.io/webrtcPeer', {
      path: '/io/webrtc',
      query: {},
    });

    this.socket.on('connection-success', success => {
      console.log(success);
    });

    this.socket.on('offerOrAnswer', sdp => {
      this.sdp = JSON.stringify(sdp);

      // set sdp as remote description
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    this.socket.on('candidate', candidate => {
      // console.log('From Peer... ', JSON.stringify(candidate))
      // this.candidates = [...this.candidates, candidate]
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    const pc_config = {
      iceServers: [
        // {
        //   urls: 'stun:[STUN_IP]:[PORT]',
        //   'credentials': '[YOR CREDENTIALS]',
        //   'username': '[USERNAME]'
        // },
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
        this.sendToPeer('candidate', e.candidate);
      }
    };

    // triggered when there is a change in connection state
    this.pc.oniceconnectionstatechange = e => {
      console.log(e);
    };

    this.pc.onaddstream = e => {
      debugger;
      // this.remoteVideoref.current.srcObject = e.streams[0]
      this.setState({
        remoteStream: e.stream,
      });
    };

    const success = stream => {
      console.log(stream.toURL());
      this.setState({
        localStream: stream,
      });
      this.pc.addStream(stream);
    };

    const failure = e => {
      console.log('getUserMedia Error: ', e);
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
    this.socket.emit(messageType, {
      socketID: this.socket.id,
      payload,
    });
  };

  createOffer = () => {
    console.log('Offer');

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    // initiates the creation of SDP
    this.pc.createOffer({offerToReceiveVideo: 1}).then(sdp => {
      // console.log(JSON.stringify(sdp))

      // set offer sdp as local description
      this.pc.setLocalDescription(sdp);

      this.sendToPeer('offerOrAnswer', sdp);
    });
  };

  createAnswer = () => {
    console.log('Answer');
    this.pc.createAnswer({offerToReceiveVideo: 1}).then(sdp => {
      // console.log(JSON.stringify(sdp))

      // set answer sdp as local description
      this.pc.setLocalDescription(sdp);

      this.sendToPeer('offerOrAnswer', sdp);
    });
  };

  setRemoteDescription = () => {
    // retrieve and parse the SDP copied from the remote peer
    const desc = JSON.parse(this.sdp);

    // set sdp as remote description
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  addCandidate = () => {
    // retrieve and parse the Candidate copied from the remote peer
    // const candidate = JSON.parse(this.textref.value)
    // console.log('Adding candidate:', candidate)

    // add the candidate to the peer connection
    // this.pc.addIceCandidate(new RTCIceCandidate(candidate))

    this.candidates.forEach(candidate => {
      console.log(JSON.stringify(candidate));
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  render() {
    const {localStream, remoteStream} = this.state;

    const remoteVideo = remoteStream ? (
      <RTCView
        key={2}
        mirror={true}
        style={{...styles.rtcViewRemote}}
        objectFit="contain"
        streamURL={remoteStream && remoteStream.toURL()}
      />
    ) : (
      <View style={{padding: 15}}>
        <Text style={{fontSize: 22, textAlign: 'center', color: 'white'}}>
          Waiting for Peer connection ...
        </Text>
      </View>
    );

    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="blue" barStyle={'dark-content'} />
        <View style={{...styles.buttonsContainer}}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={this.createOffer}>
              <View style={styles.button}>
                <Text style={{...styles.textContent}}>Call</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={this.createAnswer}>
              <View style={styles.button}>
                <Text style={{...styles.textContent}}>Answer</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{...styles.videosContainer}}>
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              bottom: 10,
              right: 10,
              width: 100,
              height: 200,
              backgroundColor: 'black', //width: '100%', height: '100%'
            }}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => localStream._tracks[1]._switchCamera()}>
                <View>
                  <RTCView
                    key={1}
                    zOrder={0}
                    objectFit="cover"
                    style={{...styles.rtcView}}
                    streamURL={localStream && localStream.toURL()}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{...styles.scrollView}}>
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {remoteVideo}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 5,
    paddingVertical: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  textContent: {
    fontFamily: 'Avenir',
    fontSize: 20,
    textAlign: 'center',
  },
  videosContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rtcView: {
    width: 100, //dimensions.width,
    height: 200, //dimensions.height / 2,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
    // flexDirection: 'row',
    backgroundColor: 'teal',
    padding: 15,
  },
  rtcViewRemote: {
    width: dimensions.width - 30,
    height: 200, //dimensions.height / 2,
    backgroundColor: 'black',
  },
});

export default App;

// import React, {Component} from 'react';
// import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
// import io from 'socket.io-client';
// import server from './src/constants/server';

// const socket = io(server);
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals,
// } from 'react-native-webrtc';

// const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
// const pc = new RTCPeerConnection(configuration);
// const remote_pc = new RTCPeerConnection(configuration);

// let isFront = true;

// export default class WebRtc extends Component {
//   constructor() {
//     super();
//     this.state = {
//       localStreamURL: null,
//       remoteStreamURL: null,
//       caller: false,
//     };
//   }

//   call = () => {
//     mediaDevices.enumerateDevices().then(sourceInfos => {
//       let videoSourceId;
//       for (let i = 0; i < sourceInfos.length; i++) {
//         const sourceInfo = sourceInfos[i];
//         if (
//           sourceInfo.kind == 'videoinput' &&
//           sourceInfo.facing == (isFront ? 'front' : 'environment')
//         ) {
//           videoSourceId = sourceInfo.deviceId;
//         }
//       }

//       mediaDevices
//         .getUserMedia({
//           audio: true,
//           video: {
//             mandatory: {
//               minWidth: 500, // Provide your own width, height and frame rate here
//               minHeight: 300,
//               minFrameRate: 30,
//             },
//             facingMode: isFront ? 'user' : 'environment',
//             optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//           },
//         })
//         .then(stream => {
//           pc.addStream(stream);
//           pc.createOffer().then(sdp => {
//             console.warn(sdp);
//             console.warn('Stream', stream);
//             this.setState({caller: true}, () => {
//               pc.setLocalDescription(sdp).then(() => {
//                 socket.emit('offerCaller', pc.localDescription);
//               });
//               socket.on('Answer', message => {
//                 console.warn('Answer', message);
//                 pc.setRemoteDescription(message);
//               });
//             });
//           });
//           this.setState({localStreamURL: stream});
//         })
//         .catch(error => {
//           // Log error
//         });
//     });
//   };

//   // componentDidMount() {
//   //   mediaDevices.enumerateDevices().then(sourceInfos => {
//   //     let videoSourceId;
//   //     for (let i = 0; i < sourceInfos.length; i++) {
//   //       const sourceInfo = sourceInfos[i];
//   //       if (
//   //         sourceInfo.kind == 'videoinput' &&
//   //         sourceInfo.facing == (isFront ? 'front' : 'environment')
//   //       ) {
//   //         videoSourceId = sourceInfo.deviceId;
//   //       }
//   //     }

//   //     mediaDevices
//   //       .getUserMedia({
//   //         audio: true,
//   //         video: true,
//   //         video: {
//   //           mandatory: {
//   //             minWidth: 500, // Provide your own width, height and frame rate here
//   //             minHeight: 0,
//   //             minFrameRate: 0,
//   //           },
//   //           facingMode: isFront ? 'user' : 'environment',
//   //           optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//   //         },
//   //       })
//   //       .then(stream => {
//   //         pc.addStream(stream);
//   //         // pc.createOffer().then(sdp => {
//   //         //   pc.setLocalDescription(sdp).then(() => {
//   //         //     // socket.emit('offer', pc.localDescription);
//   //         //   });
//   //         // });

//   //         // this.setState({localStreamURL: stream});
//   //       })
//   //       .catch(error => {
//   //         // Log error
//   //       });
//   //   });

//   //   // socket.on('offerReciever', message => {
//   //   //   console.warn(message);
//   //   //   // remote_pc.setRemoteDescription(message).then(() => {
//   //   //   //   remote_pc.createAnswer().then(sdp => {
//   //   //   //     remote_pc.setLocalDescription(sdp).then(() => {
//   //   //   //       socket.emit('Answer', remote_pc.localDescription);
//   //   //   //     });
//   //   //   //   });
//   //   //   // });
//   //   //   // remote_pc.onaddstream = event => {
//   //   //   //   this.setState({remoteStreamURL: event.stream});
//   //   //   // };
//   //   // });
//   //   // socket.on('Answer', message => {
//   //   //   pc.setRemoteDescription(message);
//   //   // });

//   //   // pc.onicecandidate = event => {
//   //   //   // send event.candidate to peer

//   //   //   if (event.icecandidate) {
//   //   //     socket.emit('candidate', candidate);
//   //   //   }
//   //   // };

//   //   // socket.on('candidate', candidate => {
//   //   //   const c = new RTCIceCandidate(candidate);
//   //   //   pc.addIceCandidate(c);
//   //   // });

//   // }

//   // remote_pc.setRemoteDescription(new RTCSessionDescription(offer), ...) {
//   //   remote_pc.createAnswer()
//   // }

//   componentDidMount() {
//     pc.onicecandidate = event => {
//       // send event.candidate to peer

//       if (event.icecandidate) {
//         socket.emit('candidate', candidate);
//       }
//     };

//     socket.on('candidate', candidate => {
//       const c = new RTCIceCandidate(candidate);
//       pc.addIceCandidate(c);
//     });
//     socket.on('offerReciever', message => {
//       if (this.state.caller === false) {
//         // console.warn('LL', message);
//         alert('KHAN');
//         remote_pc.setRemoteDescription(message).then(() => {
//           remote_pc.createAnswer().then(sdp => {
//             remote_pc.setLocalDescription(sdp).then(() => {
//               socket.emit('Answer', remote_pc.localDescription);
//             });
//           });
//         });
//         remote_pc.onaddstream = event => {
//           console.warn(event.stream);
//           this.setState({remoteStreamURL: event.stream});
//         };
//       }
//     });
//   }
//   render() {
//     return (
//       <View style={{flex: 1}}>
//         <TouchableOpacity
//           style={{
//             // marginTop: 20,
//             width: 150,
//             height: 50,
//             backgroundColor: 'green',
//             position: 'absolute',
//             bottom: 50,
//             left: 100,
//             zIndex: 100,
//             borderRadius: 30,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//           onPress={() => this.call()}>
//           <Text style={{color: 'white'}}> Start Call</Text>
//         </TouchableOpacity>
//         {this.state.remoteStreamURL ? (
//           <View style={{flex: 1}}>
//             <View style={styles.localStream}>
//               {this.state.localStreamURL && (
//                 <RTCView
//                   streamURL={this.state.localStreamURL.toURL()}
//                   style={styles.rtcView}
//                 />
//               )}
//             </View>
//             <View style={styles.videoWidget}>
//               {this.state.remoteStreamURL && (
//                 <RTCView
//                   streamURL={this.state.remoteStreamURL.toURL()}
//                   style={styles.rtcView}
//                 />
//               )}
//             </View>
//           </View>
//         ) : (
//           this.state.localStreamURL && (
//             <RTCView
//               streamURL={this.state.localStreamURL.toURL()}
//               style={styles.rtcView}
//             />
//           )
//         )}

//         {/* <View style={styles.videoWidget}>
//           {this.state.localStreamURL && (
//             <RTCView
//               streamURL={this.state.localStreamURL.toURL()}
//               style={styles.rtcView}
//             />
//           )}
//         </View> */}
//       </View>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   videoWidget: {
//     position: 'relative',
//     flex: 1,
//     backgroundColor: '#fff',
//     // width: "100%",
//   },
//   rtcView: {
//     flex: 1,
//     // width: "100%",
//     backgroundColor: 'black',
//     position: 'relative',
//   },
//   localStream: {
//     position: 'absolute',
//     height: '20%',
//     width: '30%',
//     top: 5,
//     left: 5,
//     zIndex: 100,
//     backgroundColor: 'black',
//   },
// });

// import React from 'react';
// import StackNavigator from './src/screens/StackNavigator';
// import {Provider} from 'react-redux';
// import store from './src/redux/store';
// // console.disableYellowBox = true;

// export default class App extends React.Component {
//   render() {
//     return (
//       <Provider store={store}>
//         <StackNavigator />
//       </Provider>
//     );
//   }
// }
