import React, {Component} from 'react';
import {sign_in} from './data';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  StatusBar,
} from 'react-native';
import {Icon} from 'react-native-elements';

var name_login = '';
export default class SignInScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      username: '',
      password: '',
    };
  }

  onClickLogin = async () => {
    name_login = this.state.username;
    // console.log(name_login);
    let checker = await sign_in(this.state);
    if (checker === 1) {
      // this.props.navigation.navigate('rich', {boss});
      this.props.navigation.navigate('Tabs', {username: this.state.username});
    }
  };

  render() {
    // const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar
          // translucent
          // androidStatusBarColor="#F9F9F9"
          // iosBarStyle="dark-content"
          barStyle="dark-content"
          backgroundColor="rgba(0, 0, 0, 0.251)"
        />
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
            placeholder="username"
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
          onPress={() => this.onClickLogin()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={() => this.onClickLogin('restore_password')}>
          <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.textinformation}
          onPress={() => this.props.navigation.navigate('Signup')}>
          <Text>Don't have an account? Sign up</Text>
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

export {name_login};
