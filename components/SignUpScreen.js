import React, {Component} from 'react';
import {sign_up} from './data';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import {Icon} from 'react-native-elements';

var name_signup = '';
export default class SignUpScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      username: '',
      password: '',
    };
  }

  onClickListener = async () => {
    name_signup = this.state.username;
    let checker = await sign_up(this.state);
    if (checker === 1) {
      // this.props.navigation.navigate('Urdu', {boss});
      this.props.navigation.navigate('Tabs', {username: this.state.username});
    }
  };

  render() {
    // const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            style={styles.logoIcon}
            source={require('../assets/logo.png')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail" color={'#aa0022'} marginLeft={15} />
          <TextInput
            style={styles.inputs}
            placeholder="Username"
            keyboardType="default"
            underlineColorAndroid="transparent"
            onChangeText={username => this.setState({username})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" color={'#aa0022'} marginLeft={15} />
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            onChangeText={password => this.setState({password})}
          />
        </View>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this.onClickListener()}>
          <Text style={styles.loginText}>Sign up</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  inputContainer: {
    // borderBottomColor: '#F5FCFF',
    // backgroundColor: '#FFFFFF',
    borderRadius: 30,
    // borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: 'white',
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
    backgroundColor: '#db3e00',
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
    color: 'black',
  },
});

export {name_signup};
