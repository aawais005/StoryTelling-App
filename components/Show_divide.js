import React, {Component} from 'react';

import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {Text} from 'native-base';
import {get_story_side, downloadaudio_side} from './data.js';

import WebView from 'react-native-webview';
import {Icon} from 'react-native-elements';
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

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class Show_Divdide_layout extends Component {
  constructor() {
    super();
    this.state = {
      authorName: 'Author',
      currentPage: 0,
      username: '',
      title: '',
      audio_url: '',
      html_content: '',
      no_pages: 0,
      pictures: [],
      text: [],
      loading: false,
    };
  }

  async componentDidMount() {
    var side_dic = await get_story_side(this.state.username, this.state.title);
    var html_pic_dic = side_dic['html_pic_dic'];
    var aud_dic = side_dic['audio_url'];
    var html_list = html_pic_dic['list_html'];
    var pic_list = html_pic_dic['list_pic'];
    var n_pages = html_pic_dic['n_pages'];
    console.log('aud_dic:' + aud_dic);
    this.state.audio_url = aud_dic['aud_url'];
    // console.log(html_list);
    // console.log(pic_list);
    // console.log(n_pages);

    this.setState({
      text: html_list,
      pictures: pic_list,
      no_pages: n_pages,
      loading: true,
    });
  }

  go() {
    console.log('yes');
  }

  async _play_downloaded(username, title) {
    console.log('paly button');
    if (this.state.audio_url == '0') {
      alert('No audio for this story!');
      return;
    }
    var down_aud = await downloadaudio_side(
      this.state.audio_url,
      this.state.username,
      this.state.title,
    );
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

  showText = () => {
    const runFirst = `
              {'\u2066'}
              document.body.style.backgroundColor = 'white';
              // setTimeout(function() { window.alert('hi') }, 2000);
              true; // note: this is required, or you'll sometimes get silent failures
          `;
    return (
      <WebView
        style={
          {
            // width: screenWidth/2 -50,
            // height: 50
          }
        }
        dir="rtl"
        scalesPageToFit={false}
        injectedJavaScript={runFirst}
        scrollEnabled={true}
        source={{
          // view text changes here
          html:
            '<html dir="rtl" style="font-size:10px; align-content: center;"><meta name="viewport" content="width=device-width, initial-scale=2.0">' +
            this.state.text[this.state.currentPage] +
            '</html>',
          // html: this.props.navigation.getParam('st_html'),
        }}
      />
    );
  };

  render() {
    this.state.username = this.props.navigation.getParam('username');
    this.state.title = this.props.navigation.getParam('title');
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
        <View style={styles.button}>
          <View style={styles.NAVS}>
            {this.state.currentPage < this.state.no_pages - 1 ? (
              <TouchableOpacity
                onPress={function() {
                  // this.state.currentPage += 1
                  this.setState({currentPage: this.state.currentPage + 1});
                  console.log(this.state.currentPage);
                }.bind(this)}>
                <Icon
                  color="#ff8000"
                  type="font-awesome"
                  name="chevron-right"
                  size={70}
                />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity></TouchableOpacity>
              </>
            )}
            {this.state.currentPage > 0 ? (
              <TouchableOpacity
                onPress={function() {
                  this.setState({currentPage: this.state.currentPage - 1});
                }.bind(this)}>
                <Icon
                  color="#ff8000"
                  type="font-awesome"
                  name="chevron-left"
                  size={70}
                />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity></TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <Text style={styles.loginText}>Title</Text>
        <TouchableHighlight
          style = {styles.loginButton}
          onPress={console.log('hello')}>
          <Text style={styles.authorName}>Author Name</Text>
        </TouchableHighlight>

        <View style={styles.text}>
          <View style={{width: '58.5%', marginLeft: 10}}>
            {this.showText()}
          </View>
          <View style={{alignItems: 'center', width: '41.4%'}}>
            <Image
              style={styles.logoIcon}
              // source={ imgSource }
              source={{
                uri: this.state.pictures[this.state.currentPage],
                // uri:'https://earthsky.org/upl/2018/12/comet-wirtanen-Cynthia-Haithcock-Troy-NC-12-16-2018-e1545047346409.jpeg'
              }}
            />
          </View>
        </View>

        <View>
          <Button transparent style={{margin: 10, elevation: 100, zIndex: 100}}
            onPress={
              async () =>
                this._play_downloaded(this.state.username, this.state.title)
              // this.go
            }>
            <Icon
              color="#ff8000"
              // reverse
              
              type="font-awesome"
              name="play-circle"
              size={70}
            />
          </Button>
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
  loginButton: {
    // backgroundColor: 'purple',
    elevation: 100,
    zIndex: 100,
  },
  loginText: {
    alignItems: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    // justifyContent: 'space-between',
    // color: 'black',
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    width: '85%',
    // height: '50%',
    borderRadius: 15,
    borderWidth: 1,
    // marginBottom: '10%',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logoIcon: {
    width: 250,
    height: 320,
    marginBottom: '10%',
    margin: 10,
    // justifyContent: 'center',
    // resizeMode: 'contain',
  },
  NAVS: {
    // flex:1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: '100%',
    width: '99%',
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    elevation: 10,
    zIndex: 10,
  },
  authorName: {
    alignItems: 'center',
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'gray',
    // justifyContent: 'space-between',
    // color: 'black',
  },
});
