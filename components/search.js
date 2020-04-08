import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import {SearchBar} from 'react-native-elements';

import {
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  Text,
} from 'react-native';
const screenWidth = Dimensions.get('window').width;

import {
  get_usernames,
  get_titles,
  get_title_pic,
  get_story1,
  check_user,
} from './data';

import {Card} from 'react-native-elements';

// import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

// const { width: screenWidth } = Dimensions.get('window')

import {
  Container,
  Content,
  // Icon,
  Header,
  Left,
  Body,
  Right,
  Segment,
  Button,
  Spinner,
} from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import {Icon} from 'react-native-elements';

// var images = [
//   'https://unsplash.it/300/?random',
//   'https://unsplash.it/350/?random',
//   'https://unsplash.it/400/?random',
//   'https://unsplash.it/450/?random',
//   'https://unsplash.it/500/?random',
//   'https://unsplash.it/550/?random',
//   'https://unsplash.it/600/?random',
//   'https://unsplash.it/550/?random',
//   'https://unsplash.it/550/?random',
//   'https://unsplash.it/550/?random',
// ];

export default class Home extends React.Component {
  state = {
    //Assing a array to your pokeList state
    query: '',
    stories: [],
    texts: [],
    // html_list: [],
    username_list: [],
    flag_list: [],
    my_username: '',
    //Have a loading state where when data retrieve returns data.
    loading: true,
    flag: 0,
  };

  // updateSearch = search => {
  //   this.setState({search});
  // };

  async go_other_profile() {
    console.log(this.state.query);
    console.log(this.state.my_username);
    if (this.state.query == this.state.my_username) {
      alert('The user has entered own username!');
      return;
    }

    var u_flag = await check_user(this.state.query);
    // console.log('yee');
    if (u_flag == '0') {
      // console.log('yee1');
      alert('No user of this name exists!');
      return;
    } else {
      this.props.navigation.navigate('other_profile', {
        query: this.state.query,
        curr_username: this.state.my_username,
      });
    }
  }

  async componentDidMount() {
    var text = [];
    var images = [];
    var username_l = [];
    var flag_l = [];

    var user_list = await get_usernames();
    if (user_list == null) {
      this.setState({
        loading: false,
      });
      return;
    }
    let users = Object.keys(user_list);

    console.log(users);

    //remove my own username
    const index = users.indexOf(this.state.my_username);
    console.log(this.state.my_username);
    if (index > -1) {
      // console.log('yes');
      users.splice(index, 1);
    }

    var n_users = 3;
    // var all_user_titles = [];
    for (var j = 0; j < n_users; j++) {
      let title_list = await get_titles(users[j]);
      if (title_list == null) {
        // this.setState({
        //   loading: false,
        // });
        // return;
        continue;
      }
      let titles = Object.keys(title_list);

      for (var k = 0; k < titles.length; k++) {
        // all_user_titles.push(titles[k]);
        text.push(titles[k]);
        username_l.push(users[j]);
      }

      let arr_2d_titles = [];
      for (var i = 0; i < titles.length; i++) {
        arr_2d_titles[i] = title_list[titles[i]];
      }
      //0:user,1:title,2:flag
      // console.log(arr_2d_titles);

      for (var a = 0; a < arr_2d_titles.length; a++) {
        let title_pic_list = await get_title_pic(
          arr_2d_titles[a][0],
          arr_2d_titles[a][1],
        );

        // console.log(title_pic_list);
        var pic_url = title_pic_list[2];
        images.push(pic_url);
        flag_l.push(arr_2d_titles[a][2]);
      }
    }

    console.log('images length:' + images.length);
    console.log('text length:' + text.length);
    console.log('username length:' + username_l.length);
    // console.log('html_l length:' + html_l.length);
    console.log('flag_l length:' + flag_l.length);
    // flg = 1;
    // setTimeout( ()=> {
    this.setState({
      stories: images,
      username_list: username_l,
      texts: text,
      // html_list: html_l,
      flag_list: flag_l,
      loading: false,
      // flag: flg,
    });
    // }, 1000);
  }

  render() {
    this.state.my_username = this.props.navigation.getParam('username');
    return (
      <Container>
        {/* <SearchBar
          placeholder="Type username..."
          onChangeText={query => this.setState({query})}
          value={this.state.query}
        /> */}
        <View style = {{flexDirection: 'row', padding: 15, paddingTop: 40}}>
        <Button
          transparent
          style={Styles.buttonContainer}
          onPress={() => this.go_other_profile()}>
              <Icon
                    color="#ff8000"
                    type="font-awesome"
                    name="search"
                    size={25}
                  />
        </Button>
        <View style={Styles.inputContainer}>
          <TextInput
            style={Styles.inputs}
            placeholder="Enter username.."
            keyboardType="default"
            underlineColorAndroid="transparent"
            onChangeText={query => this.setState({query})}
          />
        </View>
        </View>
        <ScrollView style={Styles.container}>
          {this.state.loading ? (
            <Spinner style={{flex: 1, alignSelf: 'center'}} color="#ff8000" />
          ) : (
            <>
              <ScrollView style={{marginTop: 10 ,marginBottom: 40,}}>
                  <View style={Styles.TrailsContainer}>
                    {this.state.stories.map(
                      function(image, index) {
                        return (
                          <View style={Styles.card}>
                            <TouchableOpacity
                              style={Styles.TrailCard}
                              onPress={() => {
                                if (this.state.flag_list[index] == 'cont') {
                                  this.go_show_cont_story(index);
                                }
                                //  this.forceUpdate();
                              }}>
                              <ImageBackground
                                source={{uri: image}}
                                // eslint-disable-next-line react-native/no-inline-Styles
                                style={{ width: '100%', height: '100%',}}
                                imageStyle={{ borderTopLeftRadius: 15,
                                  borderTopRightRadius: 15, }}
                                // resizeMode="stretch"
                              ></ImageBackground>
                                <Text style = {Styles.loginText}>{this.state.texts[index]}</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      }.bind(this),
                    )}
                  </View>
                </ScrollView>
            </>
          )}
        </ScrollView>
      </Container>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
  },
  listView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputs: {
    height: 45,
    padding: 10,
    borderColor: '#FFFFFF',
    fontSize: 18,
    flex: 1,
  },
  buttonContainer: {
    // flex: 1,
    height: 45,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  loginButton: {
    backgroundColor: '#db3e00',
  },
  inputContainer: {
    flex: 2,
    // width: 300,
    // height: 45,
    // alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    // backgroundColor: 'yellow',
    borderRadius: 15,
  },

  loginText: {
    fontSize: 17,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingLeft: 10,
    paddingTop: 10,
  },
  TrailsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
  },
  TrailCard: {
    width: screenWidth / 3 - 12,
    height: screenWidth / 3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 50,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 1,
    zIndex: 5

  },
  card: {
    width: screenWidth /3 -9,
    height: screenWidth /3 + 72,
    borderRadius: 15,
    backgroundColor: 'lightgray',
    marginBottom: 15,
    padding: 1,
    marginBottom: 20,
    // ...elevationShadowStyle(20),
  },
});
