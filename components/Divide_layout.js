import React, {Component} from 'react';
import {uploadImage} from './data';

import {
  // Button,
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
  Text
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

import {auth, db, stor} from '../src/config';

import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {save_story, get_story1, save_story_side} from './data';
// import WebView from 'react-native-webview';
import ImagePicker from 'react-native-image-picker';
import ImageDB from './ImageDB';
// import imageAddIcon from '../assets/addicon.png';

import RNfetchBlob from 'react-native-fetch-blob';
import {Icon} from 'react-native-elements';

// import ImageResizer from 'react-native-image-resizer';
// import { actions  as RichEditorActions} from 'react-native-pell-rich-editor';
let P = 'flex';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let boss = ``;

const fs = RNfetchBlob.fs;

export default class Divdide_layout extends Component {
  constructor() {
    super();
    this.state = {
      resizedImageUri: '',
      page: 0,
      pages: [],
      richText: '',
      pictures: [],
      n_pages: [],
      dict_html: {},
      dict_pics: {},
      title: '',
      img_url: '',
      username: '',
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.forceUpdate();
    });
  }

  save = async () => {
    // Get the data here and call the interface to save the data
    //this.richText += `k`;
    // console.log(
    //   'this.richText' + this.richText + '. Type:' + typeof this.richText,
    // );
    // let html = await this.richText.getContentHtml();
    //console.log('typeof' + typeof html);
    // alert(html);
    let C = await this.richText.getContentHtml();

    this.state.dict_html[this.state.page] = C;
    this.state.dict_pics[this.state.page] = this.state.pictures[
      this.state.page
    ];
    console.log(this.state.dict_html);
    console.log(this.state.dict_pics);

    for (var key in this.state.dict_pics) {
      if (this.state.dict_pics[key] == undefined) {
        this.state.dict_pics[key] = '';
      }

      // do something with "key" and "value" variables
    }

    var n_pages = Object.keys(this.state.dict_html).length;
    var story_submit = await save_story_side(
      this.state.username,
      this.state.title,
      this.state.img_url,
      this.state.dict_html,
      this.state.dict_pics,
      n_pages,
    );
    console.log('story posted on DB!');
    alert('story posted on DB!');
  };

  addimage = imageURL => {
    this.state.pictures[this.state.page] = imageURL;
    console.log('uyuy', this.state.pictures[this.state.page]);
  };

  //   async resize(uri) {
  // 	ImageResizer.createResizedImage(uri, 80, 60, 'JPEG', 100)
  // 	  .then(({resized_uri}) => {
  // 		this.setState({
  // 		  resizedImageUri: uri,
  // 		});
  // 	  })
  // 	  .catch(err => {
  // 		console.log(err);
  // 		return Alert.alert(
  // 		  'Unable to resize the photo',
  // 		  'Check the console for full the error message',
  // 		);
  // 	  });
  // 	}

  chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [{name: 'customOptionKey', title: 'Choose Photo from DB'}],
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
        // console.log();
        this.props.navigation.navigate('ImageDB', {addimage: this.addimage});
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // alert(JSON.stringify(response));s
        // console.log('response', JSON.stringify(response));
        options = {...options, includeBase64: true};
        console.log('Image pat2h....', response.uri);

        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
        console.log('Image path....', response.uri);

        var db_image_upload = uploadImage(
          this.state.username,
          this.state.title,
          'side',
          response.uri,
        ).then(returned => {
          this.state.pictures[this.state.page] = returned;

          this.forceUpdate();
          alert('Image Added!');
          // console.log('returend' + returned);
        });
        //console.log('db_image_url:' + db_image_upload);
      }
    });
  };

  renderImage = () => {
    if (!this.state.pictures[this.state.page]) {
      return (
        <Image
          style={{
            width: 120,
            height: 180,
            // alignItems: 'center',
            // justifyContent: 'center',
            resizeMode: 'contain',
          }}
          // source={ imgSource }
          source={{uri: 'https://img.icons8.com/dusk/50/000000/add-image.png'}}
        />
      );
    } else {
      console.log('I am here, ' + this.state.pictures[this.state.page]);
      return (
        <Image
          style={styles.logoIcon}
          // source={ imgSource }
          source={{uri: this.state.pictures[this.state.page]}}
        />
      );
    }
  };

  go_to_audio = async () => {
    this.props.navigation.navigate('Audio', {
      username: this.state.username,
      title: this.state.title,
      flag:"side"
    });
  };

  go_to_artpad = async () => {
    this.props.navigation.navigate('Draw', {
      username: this.state.username,
      title: this.state.title,
    });
  };
  go_to_dict = async () => {
    this.props.navigation.navigate('ShowStory', {
      st_html: hard_html,
      username: this.state.username,
      title: this.state.title,
    });
  };

  render() {
    let that = this;
    this.state.title = this.props.navigation.getParam('title');
    this.state.img_url = this.props.navigation.getParam('img_url');
    this.state.username = this.props.navigation.getParam('username');
    if (!this.state.pages.length) {
      P = 'none';
    }
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
      <View style={styles.container}>
        {/* <Button title="Save" onPress={that.save} /> */}
        <View style={styles.NAVS}>
          {this.state.page < 10 ? (
            <TouchableOpacity
              // color="#43005B"
              // title={`Next (${this.state.page + 1})`}
              onPress={async function() {
                let C = await this.richText.getContentHtml();
                console.log(C);
                const temp = {
                  number: this.state.page,
                  content: C,
                };
                this.state.dict_html[this.state.page] = C;
                this.state.dict_pics[this.state.page] = this.state.pictures[
                  this.state.page
                ];
                this.setState({
                  pages: [...this.state.pages, temp],
                  page: this.state.page + 1,
                });
                // boss = ""
                if (this.state.dict_html[this.state.page] == undefined) {
                  await this.richText.setContentHTML('');
                } else {
                  await this.richText.setContentHTML(
                    this.state.dict_html[this.state.page],
                  );
                }
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
          {this.state.page ? (
            <TouchableOpacity
              // style={styles.NavButton}
              // color="#43005B"
              // title={`Prev (${this.state.page - 1})`}
              onPress={async function() {
                let C = await this.richText.getContentHtml();
                this.state.dict_html[this.state.page] = C;
                this.state.dict_pics[this.state.page] = this.state.pictures[
                  this.state.page
                ];
                // console.log(boss)
                this.state.pages.map(
                  async function(p) {
                    if (p.number === this.state.page - 1) {
                      boss = p.content;
                    }
                    // console.log('yes');
                    await this.richText.setContentHTML(boss);
                  }.bind(this),
                );
                this.setState({
                  page: this.state.page - 1,
                });
              }.bind(this)}>
              <Icon
                color="#ff8000"
                // reverse
                // onPress={async () =>
                //   this._play_downloaded(this.state.username, this.state.title)
                // }
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

        <Button transparent
            // bordered
            style = {{marginTop: 10, marginRight: '80%'}}
            onPress={that.go_to_dict}
            >
              <Image
                style={{width: 60, height: 60, resizeMode: 'contain'}}
                source={require('../assets/dict.png')}
              />
              {/* <Text>Dictionary</Text> */}
        </Button>

        <View style={styles.editor}>
          <View
            style={{
              flex: 1,
              width: '60%',
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              marginLeft: 10
            }}>
            {/* <SafeAreaView> */}
            <ScrollView>
            <RichEditor
              ref={rf => {
                that.richText = rf;
              }}
              initialContentHTML={boss}
              style={styles.rich}
            />
            </ScrollView>
            {/* </SafeAreaView> */}
          </View>

          <View
            style={{
              width: '40%',
              height: '90%',
              //   flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              //   borderTopLeftRadius: 15,
              //   borderBottomLeftRadius: 15,
              //   // backgroundColor: '#f08488',
            }}>
            <TouchableHighlight
              // style={ styles.picture }
              onLongPress={function() {
                if (this.state.pictures[this.state.page]) {
                  Alert.alert(
                    'Remove Image',
                    'My Alert Msg',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: function() {
                          let temp = this.state.pictures;
                          temp[this.state.page] = '';
                          this.setState({pictures: temp});
                        }.bind(this),
                      },
                    ],
                    {cancelable: false},
                  );
                }
              }.bind(this)}
              onPress={() => {
                this.chooseImage();
                // this.renderImage()
              }}>
              {this.renderImage()}
            </TouchableHighlight>
          </View>
        </View>

         <View
          style={{
            // flex: 1 / 10,
            padding: 10,
            marginBottom: '0.5%',
            flexDirection: 'row',
            height: 70,
            width: 400,
            justifyContent: 'center',
            backgroundColor: '#F5FCFF',
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
      </View>
      </Container>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '1%',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  NAVS: {
    // flex:1,
    width: '99%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10000,
    zIndex: 20000,
    // alignSelf: 'center',
    position: 'absolute',
    // verticalAlign: 'center',
    // marginTop: 100
    marginVertical: screenHeight/2 -150,
  },
  NavButtonPREV: {
    elevation: 10000,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  rich: {
    // flex: 0,
    minHeight: '100%',
    borderRadius: 15,
    // marginTop: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: '#F5FCFF',
  },
  scroll: {
    backgroundColor: '#f5fc0f',
  },
  logoIcon: {
    width: 150,
    height: 230,
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  picture: {
    width: screenWidth / 2 - 10,
    // height: screenHeight/2 - 10,
    // justifyContent: 'center',
    borderRadius: 10,
    // overflow: "hidden",
    alignItems: 'center',
    // borderWidth: 1,
  },
  editor: {
    flex: 1,
    marginTop: 15,
    width: '85%',
    height: '100%',
    borderRadius: 15,
    borderWidth: 1,

    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
