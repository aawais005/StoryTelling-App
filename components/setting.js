import React from 'react';
import {uploadImage, check_password, uploadImage_dp, get_dp} from './data';
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
      st_title: 'my_dispic',
      image_url: '',
      username: '',
      old_password: '',
      new_password: '',
      re_new_password: '',
      pic_changed: 0,
      dp_uri: '',
    };
  }


  componentDidMount() {
    var pic = this.props.navigation.getParam('profile_pic');

    this.setState({dp_uri: pic})
  }

  addimage = imageURL => {
    this.state.image_url = imageURL;
    console.log('this state img:' + this.state.image_url);
    this.forceUpdate();
    // alert('Image Added!');
  };

  go_rich = async () => {
    if (
      this.state.old_password == '' ||
      this.state.new_password == '' ||
      this.state.re_new_password == ''
    ) {
      alert('Please complete all fields!');
      return;
    }
    if (this.state.new_password != this.state.re_new_password) {
      alert('Passwords do not match! ');
      return;
    }
    if (this.state.old_password == this.state.new_password) {
      alert('New password entered is same as old password!');
      return;
    }

    let ch_pass = await check_password(
      this.state.username,
      this.state.old_password,
      this.state.new_password,
    );
  };

  go_upload_dp = async () => {
    if (this.state.dp_uri == '') {
      alert('no image selected!');
      return;
    }
    var db_image_upload = await uploadImage_dp(
      this.state.username,
      this.state.dp_uri,
    );
    // alert('DP uploaded!');
    this.state.pic_changed = 1;
  };

  go_profile = async () => {
    this.props.navigation.navigate('Profile', {
      pic_changed: this.state.pic_changed,
      new_pic_url: this.state.image_url,
    });
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
        // console.log('Image path....', response.uri).then(returned => {
        this.state.image_url = response.uri;
        this.state.dp_uri = response.uri;
        this.forceUpdate();
        alert('Image Added!');
        // console.log('returend' + returned);
        // });
        //console.log('db_image_url:' + db_image_upload);
      }
    });
  };


  render() {
    this.state.username = this.props.navigation.getParam('username');
    return (
      <Container>
      <Header style = {{ backgroundColor: '#F9F9F9'}}
        androidStatusBarColor="#F9F9F9"
        iosBarStyle="dark-content">
          <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between',}}>
          {/* arrow-right */}
          {/* check */}
            <Button transparent 
              // style={{
              //     marginRight: '92%',
              //     // marginTop: '2%',
              //     // marginBottom: '5%',
              // }}
              onPress={() => this.props.navigation.goBack()}

          >
            <Icon
              color="orange"
              // reverse
              // onPress={() => this.props.navigation.goBack()}
              type="font-awesome"
              name="arrow-right"
              size={40}
            />
          </Button>
          <Text style = {{fontSize: 22, fontWeight: 'bold', margin: 10, color: 'orange'}}>Edit profile</Text>
          <Button transparent 
            // style={{
            //     marginRight: '80%',
            //     // marginTop: '2%',
            //     // marginBottom: '5%',
            // }}
            onPress={() => this.go_profile()}
          >
            <Icon
              color="orange"
              // reverse
              // onPress={() => this.props.navigation.goBack()}
              type="font-awesome"
              name="check"
              size={40}
            />
          </Button>
          </View>
      </Header>
      <Content>
      <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            padding: 15,
            // justifyContent: 'flex-start',
          }}>
          <Button transparent
          style={{width: 100, height: 100, borderRadius: 50}}>
          <Image
            source={{
              uri: this.state.dp_uri,
            }}
            style={{width: 100, height: 100, borderRadius: 50}}
          />
          </Button>
          <Button transparent
            onPress={() => {
              this.chooseImage();
              // this.renderImage();
            }}  
          >
            <Text
              style={{color: 'blue' , fontSize: 18}}>
             Change Profile Picture </Text>
          </Button>
        </View>
       
        <View style = {{padding: 10, alignItems: 'center'}}>
        <View style={styles.inputContainer}>
           <TextInput
              style={styles.inputs}
              placeholder="Current Password"
              secureTextEntry={true}
              keyboardType="default"
              underlineColorAndroid="transparent"
              onChangeText={old_password => this.setState({old_password})}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="New Password"
              secureTextEntry={true}
              keyboardType="default"
              underlineColorAndroid="transparent"
              onChangeText={new_password => this.setState({new_password})}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Re-Enter New Password"
              secureTextEntry={true}
              keyboardType="default"
              underlineColorAndroid="transparent"
              onChangeText={re_new_password => this.setState({re_new_password})}
            />
          </View>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => this.go_rich()}>
            <Text style={styles.loginText}> Change Password</Text>
          </TouchableHighlight>
            
        </View>
      </Content>
    </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainer: {
    borderColor: 'orange',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  logoIcon: {
    width: 320,
    height: 150,
    justifyContent: 'center',
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
  textinformation: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 220,
    // position: 'absolute',
    bottom: 10,
  },
  loginButton: {
    backgroundColor: 'orange',
  },
  logo: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
  },
  loginText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});
