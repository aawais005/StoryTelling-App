import React, {Component} from 'react';
import {auth, db, stor} from '../src/config';
import {NavigationEvents} from 'react-navigation';

import {
  AppRegistry,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Text,
  Image,
  // Button,
  Alert,
} from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Segment,
  Button,
  Spinner,
} from 'native-base';

import {Icon} from 'react-native-elements';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNfetchBlob from 'react-native-fetch-blob';

import {uploadAudio} from './data';

// More info on all the options is below in the READM
//E...just some common use cases shown here
var options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const Blob = RNfetchBlob.polyfill.Blob;
const fs = RNfetchBlob.fs;
window.XMLHttpRequest = RNfetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class AudioExample extends Component {
  state = {
    username: '',
    title: '',
    flag:'',
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
    hasPermission: undefined,
  };

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization().then(isAuthorised => {
      this.setState({hasPermission: isAuthorised});

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = data => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = data => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(
            data.status === 'OK',
            data.audioFileURL,
            data.audioFileSize,
          );
        }
      };
    });
  }

  _renderButton(title, onPress, active) {
    var style = active ? styles.activeButtonText : styles.buttonText;

    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>{title}</Text>
      </TouchableHighlight>
    );
  }

  _renderPauseButton(onPress, active) {
    var style = active ? styles.activeButtonText : styles.buttonText;
    var title = this.state.paused ? 'RESUME' : 'PAUSE';
    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>{title}</Text>
      </TouchableHighlight>
    );
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn("Can't pause, not recording!");
      return;
    }

    try {
      const filePath = await AudioRecorder.pauseRecording();
      this.setState({paused: true});
    } catch (error) {
      console.error(error);
    }
  }

  async _resume() {
    if (!this.state.paused) {
      console.warn("Can't resume, not paused!");
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({paused: false});
    } catch (error) {
      console.error(error);
    }
  }

  async _stop() {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({stoppedRecording: true, recording: false, paused: false});

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _play() {
    if (this.state.recording) {
      await this._stop();
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      var sound = new Sound(this.state.audioPath, '', error => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        sound.play(success => {
          if (success) {
            // console.log('successfully finished playing');
            alert('Finished Playing!');
          } else {
            alert('Please Try Again!');
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);
  }

  async _record() {
    actually_recored = 1;
    upload_record = 1;
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true, paused: false});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath, fileSize) {
    this.setState({finished: didSucceed});
    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath} and size of ${fileSize || 0} bytes`,
    );
    alert('Audio Recorded!');
  }

  render() {
    this.state.username = this.props.navigation.getParam('username');
    this.state.title = this.props.navigation.getParam('title');
    this.state.flag = this.props.navigation.getParam('flag');


    return (
      <Container>
      <Header style = {{ backgroundColor: '#F9F9F9'}}
                  androidStatusBarColor="#F9F9F9"
                  iosBarStyle="dark-content">
            <Button transparent
            style = {{marginRight: '93%'}}
              onPress={() => this.props.navigation.goBack()}
            >
            <Icon
              color="#ff8000"
              type="font-awesome"
              name="arrow-right"
              size={40}
            />
          </Button>
      </Header>
        {/* <NavigationEvents
          onWillFocus={payload => {
            this.state.username = payload.state.params.username;
            this.state.title = payload.state.params.title;
            console.log('caught_username:' + this.state.username);
          }}
        /> */}
        <View style={styles.container}>
          {this._renderButton(
            'RECORD',
            () => {
              this._record();
            },
            this.state.recording,
          )}
          {this._renderButton('PLAY', () => {
            this._play();
          })}
          {this._renderButton('STOP', async () => {
            this._stop();
            await uploadAudio(
              this.state.username,
              this.state.title,
              this.state.flag,
              this.state.audioPath,
            );
          })}
          {this._renderPauseButton(() => {
            this.state.paused ? this._resume() : this._pause();
          })}
          {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
          <Text style={styles.progressText}>{this.state.currentTime}s</Text>
        </View>
      </Container>

    );
  }
}
var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // backgroundColor: '#1e90ee',
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#ff8000',
  },
  button: {
    padding: 20,
  },
  disabledButtonText: {
    color: '#eee',
  },
  buttonText: {
    fontSize: 20,
    color: '#ff8000',
  },
  activeButtonText: {
    fontSize: 20,
    color: 'yellow',
  },
});

export default AudioExample;
