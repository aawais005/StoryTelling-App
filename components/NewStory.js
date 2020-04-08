import React from 'react';
import {uploadImage} from './data';
import {NavigationEvents} from 'react-navigation';

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  I18nManager,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

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

var glob_url = 'nothing';

export default class Profile extends React.Component {
  constructor(props) {
    super();
    this.state = {
      st_title: '',
      image_url: '',
      username: '',
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.forceUpdate();
    });
  }

  addimage = imageURL => {
    this.state.image_url = imageURL;
    console.log('this state img:' + this.state.image_url);
    this.forceUpdate();
    alert('Image Added!');
  };

  go_rich = async () => {
    if (this.state.st_title == '' || this.state.image_url == '') {
      alert('Title or Image not entered!');
    } else {
      var my_title = this.state.st_title;
      var my_url = this.state.image_url;
      var username1 = this.state.username;
      this.props.navigation.navigate('Rich', {
        glob_url,
        username: username1,
        title: my_title,
        img_url: my_url,
      });
    }
  };

  go_divide = async () => {
    if (this.state.st_title == '' || this.state.image_url == '') {
      alert('Title or Image not entered!');
    } else {
      var my_title = this.state.st_title;
      var my_url = this.state.image_url;
      var username1 = this.state.username;
      this.props.navigation.navigate('Divide_layout', {
        username: username1,
        title: my_title,
        img_url: my_url,
      });
    }
  };

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
          this.state.st_title,
          'cont',
          response.uri,
        ).then(returned => {
          this.state.image_url = returned;
          this.forceUpdate();
          alert('Image Added!');
          // console.log('returend' + returned);
        });
        //console.log('db_image_url:' + db_image_upload);
      }
    });
  };

  renderImage = () => {
    if (!this.state.image_url) {
      return (
        <Icon
          color="gray"
          style = {{marginLeft: '90%'}}
          // reverse
          // onPress={() => this.props.navigation.goBack()}
          type="font-awesome"
          name="image"
          size={50}
        />
      );
    } else {
      return (
        <Image
          style={styles.logoIcon}
          // source={ imgSource }
          source={{uri: this.state.image_url}}
        />
      );
    }
  };

  render() {
    this.state.username = this.props.navigation.getParam('username');
    return (
      <Container>
        {/* <NavigationEvents
          onWillFocus={payload => {
            this.state.username = payload.state.params.username;
            // console.log('caught_username:' + this.state.username);
          }}
        /> */}

        <Header style = {{ backgroundColor: '#F9F9F9'}}
          androidStatusBarColor="#F9F9F9"
          iosBarStyle="dark-content">
            <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
              {/* <Button transparent 
                // onPress={() => this.props.navigation.goBack()}
                >
                <Icon
                color="#ff8000"
                type="font-awesome"
                name="arrow-right"
                size={40}
                />
              </Button> */}
            <Text style = {{fontSize: 22, fontWeight: 'bold', margin: 10, color: 'orange'}}>Add Story Info</Text>
            {/* <Image
              style={{ resizeMode: 'cover', width: 300, height: 100,}}
              source={require('../assets/logo.png')}
            /> */}
            <Button transparent 
              // onPress={() => this.go_profile()}
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
        <Button
            bordered
            transparent
            style={{marginRight: '80%' ,marginTop: '5%', height: 150, width: 150, justifyContent: 'center'}}
            onLongPress={function() {
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
                      this.setState({image_url: ''})
                    }.bind(this),
                  },
                ],
                {cancelable: false},
              );
            }.bind(this)}
            onPress={() => {
              this.chooseImage();
              // this.renderImage();
            }}>
            {this.renderImage()}
        </Button>

          <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="عنوان"
            keyboardType="default"
            // underlineColorAndroid = "black"
            onChangeText={st_title => this.setState({st_title})}
          />
        </View>
        <View style = {{flexDirection: 'row', padding: 10, justifyContent: 'space-between'}}>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.go_rich()}>
            <Text style={styles.loginText}> Continuous Layout</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.go_divide()}>
            <Text style={styles.loginText}> Page Layout</Text>
          </TouchableHighlight>
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
    // alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: 'white',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    marginLeft: '15%',
    marginTop: '3%',
    width: '60%',
    height: 50,
    marginBottom: 20,
  },
  inputs: {
    fontSize: 20,
  },
  logoIcon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderColor: 'black',
    borderWidth: 1
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 300,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#ff8000',
  },
  loginText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});