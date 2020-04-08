import React, {Component} from 'react';

import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

var story_title = '';

export default class Take_title extends Component {
  constructor(props) {
    super();
    this.state = {
      title: '',
    };
  }

  title_insert = async () => {
    story_title = this.state.title;
  };

  onClickCreateStory = async () => {
    var title_add = await this.title_insert();
    this.props.navigation.navigate('NewStory');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="عنوان"
            keyboardType="default"
            underlineColorAndroid="transparent"
            onChangeText={title => this.setState({title})}
          />
        </View>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          onPress={() => this.onClickCreateStory()}>
          <Text style={styles.loginText}>Done</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'antiquewhite',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
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

export {story_title};
