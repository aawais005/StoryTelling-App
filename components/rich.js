import React from 'react';

import {uploadImage} from './data';

import {
  // Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  I18nManager,
  Text,
  Image
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

import {NavigationEvents} from 'react-navigation';

import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {save_story, get_story1} from './data';

import ImagePicker from 'react-native-image-picker';
import RNfetchBlob from 'react-native-fetch-blob';

const fs = RNfetchBlob.fs;

// const initHTML = `<br/>
// <center><b>Pell.js Rich Editor</b></center>
// <center>React Native</center>
// <br/>
// <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" ></br></br>
// </br></br>
// `;

class Example extends React.Component {
  constructor(props) {
    super();
    I18nManager.forceRTL(true);
    this.state = {
      text: '',
      richText: '',
      username: '',
      title: '',
      img_url: '',
      pad_url: '',
      draw_check: 0,
      replaced_html: '',
      syno_check: '',
    };
  }

  async componentDidMount() {}

  save = async () => {
    // Get the data here and call the interface to save the data
    //this.richText += `k`;
    // console.log(
    //   'this.richText' + this.richText + '. Type:' + typeof this.richText,
    // );
    let html = await this.richText.getContentHtml();

    //console.log('typeof' + typeof html);
    // alert(html);

    var story_submit = await save_story(
      this.state.username,
      this.state.title,
      this.state.img_url,
      html,
    );

    // console.log('story posted on DB!');
    // console.log(html);
    alert('story posted on DB!');
  };

  //awais code
  addimage = imageLink => {
    // console.log(check)
    this.richText.insertImage(imageLink);
  };

  chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);

        // alert(response.customButton);
        this.props.navigation.navigate('ImageDB', {addimage: this.addimage});
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // alert(JSON.stringify(response));s
        // console.log('response', JSON.stringify(response));
        options = {...options, includeBase64: true};
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
        // console.log(response.uri);
        // this.richText.insertImage(`data:image/jpeg;base64,${response.data}`);
        var db_image_upload = uploadImage(
          this.state.username,
          this.state.title,
          'cont',
          response.uri,
        ).then(returned => {
          this.richText.insertImage(returned);
          // console.log('returend' + returned);
        });
        //console.log('db_image_url:' + db_image_upload);
        // this.richText.insertImage(src: `data:${response.mime};base64,${response.data}`)
      }
    });
  };

  onPressAddImage = () => {
    // insert URL
    this.richText.insertImage(
      'https://firebasestorage.googleapis.com/v0/b/storytellingapp-afcd9.appspot.com/o/images%2F1.jpeg?alt=media&token=0fde5fc9-e14a-44fc-a8da-16669bcb36ea',
    );
    // this.richText.blurContentEditor();
  };

  onHome = () => {};

  go = async () => {
    this.props.navigation.navigate('Show_cont_story', {
      username: this.state.username,
      title: this.state.title,
    });
  };

  go_to_audio = async () => {
    this.props.navigation.navigate('Audio', {
      username: this.state.username,
      title: this.state.title,
      flag: 'cont',
    });
  };

  go_to_artpad = async () => {
    this.props.navigation.navigate('Draw', {
      username: this.state.username,
      title: this.state.title,
    });
  };
  go_to_dict = async () => {
    let dic_html = await this.richText.getContentHtml();

    this.props.navigation.navigate('Syno', {
      dic_html: dic_html,
      // username: this.state.username,
      // title: this.state.title,
    });
  };

  render() {
    this.state.title = this.props.navigation.getParam('title');
    this.state.img_url = this.props.navigation.getParam('img_url');
    this.state.username = this.props.navigation.getParam('username');
    this.state.pad_url = this.props.navigation.getParam('glob_url');
    this.state.draw_check = this.props.navigation.getParam('draw_check');
    this.state.replaced_html = this.props.navigation.getParam('replaced_html');
    this.state.syno_check = this.props.navigation.getParam('syno_check');

    if (this.state.syno_check == 1) {
      // console.log('rich below');
      this.richText.setContentHTML(this.state.replaced_html);
    }

    if (this.state.draw_check == 1) {
      console.log('bruh');
      this.richText.insertImage(this.state.pad_url);
      this.state.draw_check = 0;
    }
    let that = this;
    return (
      <Container>
        <Header style = {{ backgroundColor: '#F9F9F9'}}
            androidStatusBarColor="#F9F9F9"
            iosBarStyle="dark-content">
            <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
              <Button transparent
                // onPress={() => this.props.navigation.goBack()}
              >
              <Icon
                color="#ff8000"
                type="font-awesome"
                name="arrow-right"
                size={40}
              />
            </Button>
            {/* <Text style = {{fontSize: 22, fontWeight: 'bold', margin: 10, color: 'orange'}}>Add Story Info</Text> */}
            {/* <Image
              style={{ resizeMode: 'cover', width: 300, height: 60, borderWidth: 2, borderColor: 'black'}}
              source={require('../assets/logo.png')}
            /> */}
            <Button transparent 
              onPress={that.save}
            >
              <Icon
                color="orange"
                type="font-awesome"
                name="check"
                size={40}
              />
            </Button>
            </View>
        </Header>
        
      <SafeAreaView style={styles.container}>
        {/* <View style={styles.nav}>
          <NavigationEvents
          // onWillFocus={payload => console.log('will focus', payload)}
          // onDidFocus={payload => console.log('did focus', payload)}
          // onWillBlur={payload => console.log('will blur', payload)}
          // onDidBlur={payload => console.log('did blur', payload)}

          // = async () =>
          // onWillFocus={payload => {
          //   console.log('bor');

          //   // console.log(payload);
          //   // pad_url = payload.state.params.glob_url;
          //   // this.state.title = payload.state.params.title;
          //   // this.state.img_url = payload.state.params.img_url;
          //   // this.state.username = payload.state.params.username;

          //   // console.log('given_title:' + this.state.title);
          //   // console.log('given_img_url:' + this.state.img_url);
          //   // console.log('given_username:' + this.state.username);

          //   // console.log('will focus:', pad_url);
          //   // if (
          //   //   pad_url != 'nothing' &&
          //   //   payload.action.type != 'Navigation/BACK'
          //   // ) {
          //   //   this.richText.insertImage(pad_url);
          //   // }
          // }}

          // onDidFocus={payload => console.log('did focus', payload)}
          />
          <Button color="#43005B" title="Show Story" onPress={this.go} />
          <Button color="#43005B" title="DICT" onPress={that.go_to_dict} />
        </View> */}


        <ScrollView style={styles.scroll}>
          <RichEditor
            ref={rf => {
              that.richText = rf;
            }}
            initialContentHTML={`پرانے وقتوں کی بات ہے کہ راجیت پور گاؤں میں ایک عورت رہتی تھی۔جس کا نام رخسانہ تھا۔اس عورت کا ایک بیٹا تھا۔جس کا نام اسد تھا۔اور وہ بہت ہی خوشی کی زندگی گزار رہے تھے۔کہ اچانک ایک دن رخسانہ کا خاوند ایک حادثے میں فوت ہو گیا۔
            اس وقت اسد 6سال کا تھا۔رخسانہ کا خاوند ان دونوں ماں بیٹے کے لئے روزی کمانے کا ذریعہ تھا۔
            لیکن اب رخسانہ اور اس کا بیٹا دونوں مفلسی کی زندگی گزارنے لگے۔رخسانہ اپنے بیٹے کو اچھا،کامیاب شخص بنانا چاہتی تھی۔اس لئے اس نے خود محنت مزدوری کرنا شروع کر دی۔
            اُس نے اسد کا داخلہ ایک بہت ہی اچھے سکول میں کروایا۔پھر وقت گزرتا گیا اور بیس سال کے بعد اُس کا بیٹا اسد ایک کامیاب انجینئر بن گیا۔اب ان کے پاس اللہ کا دیا سب کچھ تھا۔
            اور اس عورت نے اپنے بیٹے کی شادی بھی کر دی۔شادی کے بعد اسد پہلے جیسا نہ رہا۔

            اسد نے اپنی ماں سے برا سلوک کرنا شروع کر دیا۔`}
            style={styles.rich}
          />
        </ScrollView>
        <Button 
            transparent
            // bordered
            style = {{
                      alignSelf: 'flex-end',
                      position: 'absolute',
                      zIndex: 1,
                      elevation: 5,
                      bottom: 90,
                      right: 20,
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: '#F5FCFF'
                    }}
              onPress={that.go_to_dict}
            >
              <Image
                style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                source={require('../assets/dict.png')}
              />
              {/* <Text>Dictionary</Text> */}
        </Button>
        <View
          style={{
            // flex: 1/3,
            padding: 10,
            // marginBottom: '0.5%',
            flexDirection: 'row',
            justifyContent: 'center',
            // backgroundColor: '#F5FCFF',
          }}
          >
         <KeyboardAvoidingView behavior={'height'}
           style= {{flexDirection:'row', alignItems: 'center'}}>
           <Button transparent
              style = {{padding: 10}}
              onPress={that.go_to_artpad}
            >
            <Icon
              color="#778899"
              type="font-awesome"
              name="edit"
              // paint-brush
              size={24}
            />
          </Button>
           <Button transparent
              style = {{padding: 10}}
              onPress={that.go_to_audio}
              >
              <Icon
                color="#778899"
                type="font-awesome"
                name="microphone"
                size={24}
              />
            </Button>
            <RichToolbar
              style={styles.richBar}
              getEditor={() => that.richText}
              iconTint={'#000033'}
              selectedIconTint={'#2095F2'}
              selectedButtonStyle={{backgroundColor: 'transparent'}}
              onPressAddImage = {that.chooseImage}
            />
		       </KeyboardAvoidingView>
           </View>
      </SafeAreaView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  rich: {
    minHeight: 300,
    flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: '#F5FCFF',
  },
  scroll: {
    backgroundColor: '#ffffff',
  },
  buttonColor: {
    color: '#43005B',
  },
});

export {Example};
