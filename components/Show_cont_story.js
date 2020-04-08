import React, {Component} from 'react';
import {auth, db, stor} from '../src/config';
import RNBackgroundDownloader from 'react-native-background-downloader';
import {NavigationEvents} from 'react-navigation';

import {get_story1, aud_exist} from './data';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  I18nManager,
  Dimensions,
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

import Sound from 'react-native-sound';
import WebView from 'react-native-webview';
import {Icon} from 'react-native-elements';
// import { ScrollView } from 'react-native-gesture-handler';

const screenWidth = Math.round(Dimensions.get('window').width);

export default class SignUpScreen extends Component {
  constructor(props) {
    super();
    I18nManager.forceRTL(true);
    this.state = {
      username: '',
      title: '',
      audio_url: '',
      html_content: '',
      text:
        'پرانے وقتوں کی بات ہے کہ راجیت پور گاؤں میں ایک عورت رہتی تھی۔جس کا نام رخسانہ تھا۔اس عورت کا ایک بیٹا تھا۔جس کا نام اسد تھا۔اور وہ بہت ہی خوشی کی زندگی گزار رہے تھے۔کہ اچانک ایک دن رخسانہ کا خاوند ایک حادثے میں فوت ہو گیا۔\n            اس وقت اسد 6سال کا تھا۔رخسانہ کا خاوند ان دونوں ماں بیٹے کے لئے روزی کمانے کا ذریعہ تھا۔\n            لیکن اب رخسانہ اور اس کا بیٹا دونوں مفلسی کی زندگی گزارنے لگے۔رخسانہ اپنے بیٹے کو اچھا،کامیاب شخص بنانا چاہتی تھی۔اس لئے اس نے خود محنت مزدوری کرنا شروع کر دی۔\n            اُس نے اسد کا داخلہ ایک بہت ہی اچھے سکول میں کروایا۔پھر وقت گزرتا گیا اور بیس سال کے بعد اُس کا بیٹا اسد ایک کامیاب انجینئر بن گیا۔اب ان کے پاس اللہ کا دیا سب کچھ تھا۔\n            اور اس عورت نے اپنے بیٹے کی شادی بھی کر دی۔شادی کے بعد اسد پہلے جیسا نہ رہا۔\n            \n            اسد نے اپنی ماں سے برا سلوک کرنا شروع کر دیا۔<br><div><img src="https://unsplash.it/300/?random"></div></br>',
    };
  }

  async _play_downloaded(username, title) {
    if (this.state.audio_url == '0') {
      alert('No audio for this story!');
      return;
    }
    if (this.state.recording) {
      await this._stop();
    }
    setTimeout(() => {
      var sound = new Sound(
        `${RNBackgroundDownloader.directories.documents}/` +
          username +
          '_' +
          title +
          `audio.aac`,
        '',
        error => {
          if (error) {
            // alert('Failed to Load Audio. Please try again!');
            console.log('failed to load the sound', error);
          }
        },
      );

      setTimeout(() => {
        sound.play(success => {
          if (success) {
            console.log('successfully finished playing');
            alert('Finished Playing!');
          } else {
            alert('Please try once more!');
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);
  }

  async componentDidMount() {
    // console.log('yes');
    // console.log(this.state.username);
    // console.log(this.state.title);
    var html_aud = await get_story1(this.state.username, this.state.title);
    var html_aud_get = html_aud[0];
    this.state.audio_url = html_aud[1];
    this.setState({
      text: html_aud_get,
    });
  }

  render() {
    this.state.username = this.props.navigation.getParam('username');
    this.state.title = this.props.navigation.getParam('title');
    // console.log(this.state.username);
    const runFirst = `
            {'\u2066'}
            document.body.style.backgroundColor = 'white';
            // setTimeout(function() { window.alert('hi') }, 2000);
            true; // note: this is required, or you'll sometimes get silent failures
        `;
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

      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.loginText}>{this.state.title}</Text>
          {/* Enter here author link */}
          <WebView
            style={{
              width: screenWidth - 10,
              // height: 50
            }}
            dir="rtl"
            scalesPageToFit={false}
            injectedJavaScript={runFirst}
            scrollEnabled={true}
            source={{
              // view text changes here
              html:
                '<html dir="rtl" style="font-size:10px; align-content: center;"><meta name="viewport" content="width=device-width, initial-scale=2.0">' +
                this.state.text +
                '</html>',
              // html: this.props.navigation.getParam('st_html'),
            }}
          />
          <View style={{justifyContent: 'flex-end',}}>
            <Icon
              color="#ff8000"
              // reverse
              onPress={async () =>
                this._play_downloaded(this.state.username, this.state.title)
              }
              type="font-awesome"
              name="play-circle"
              size={70}
            />
            {/* <TouchableHighlight
              style={[styles.buttonContainer, styles.loginButton]}
              // onPress={async () => this._play_downloaded()}
            >
              <Text style={styles.loginText}>Play audio</Text>
            </TouchableHighlight> */}
          </View>
        </View>
      </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: screenWidth - 80,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: 'purple',
  },
  loginText: {
    alignItems: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    // justifyContent: 'space-between',
    // color: 'black',
  },
});
