import React, { Component } from "react";
import { NavigationEvents } from "react-navigation";

import {
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from "react-native";
const screenWidth = Dimensions.get("window").width;

import {
  get_usernames,
  get_titles,
  get_title_pic,
  get_story1,
  get_following
} from "./data";

import { Card } from "react-native-elements";

// import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

// const { width: screenWidth } = Dimensions.get('window')

import {
  Container,
  Content,
  Icon,
  Header,
  Left,
  Body,
  Right,
  Segment,
  Button,
  Spinner
} from "native-base";
import EntypoIcon from "react-native-vector-icons/Entypo";

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
    stories: [],
    texts: [],
    // html_list: [],
    username_list: [],
    flag_list: [],
    my_username: "",
    //Have a loading state where when data retrieve returns data.
    loading: true,
    flag: 0
  };

  go_show_cont_story = async index => {
    var title = this.state.texts[index];
    var username = this.state.username_list[index];
    // var flag = this.state.flag_list[index];
    this.props.navigation.navigate("Show_cont_story", { title, username });
  };
  go_show_side_story = async index => {
    // console.log("show side");
    var title = this.state.texts[index];
    var username = this.state.my_username;
    this.props.navigation.navigate("Show_divide", { title, username });
  };

  async componentDidMount() {
    var text = [];
    var images = [];
    var username_l = [];
    // var html_l = [];
    var flag_l = [];

    var following = await get_following(this.state.my_username);
    if (following == null) {
      this.setState({
        loading: false
      });
      return;
    }
    let users = Object.keys(following);

    var n_users = users.length;
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
          arr_2d_titles[a][1]
        );

        // console.log(title_pic_list);
        var pic_url = title_pic_list[2];
        images.push(pic_url);
        flag_l.push(arr_2d_titles[a][2]);
      }
    }

    // console.log("images length:" + images.length);
    // console.log("text length:" + text.length);
    // console.log("username length:" + username_l.length);
    // // console.log('html_l length:' + html_l.length);
    // console.log("flag_l length:" + flag_l.length);
    // flg = 1;
    // setTimeout( ()=> {
    this.setState({
      stories: images,
      username_list: username_l,
      texts: text,
      // html_list: html_l,
      flag_list: flag_l,
      loading: false
      // flag: flg,
    });
    // }, 1000);
  }

  render() {
    this.state.my_username = this.props.navigation.getParam("username");
    // console.log('first or after?' + this.state.my_username);
    return (
      <Container>
        <Header
          style={{
            paddingLeft: 10,
            paddingLeft: 10,
            backgroundColor: "#F9F9F9"
          }}
          androidStatusBarColor="#F9F9F9"
          iosBarStyle="dark-content"
        >
          <Left>
            <Icon name="md-person-add" />
          </Left>
          <Right>
            <EntypoIcon name="back-in-time" style={{ fontSize: 32 }} />
          </Right>
        </Header>

        {this.state.loading ? (
          <Spinner style={{ flex: 1, alignSelf: "center" }} color="#ff8000" />
        ) : (
          <ScrollView style={{ marginTop: 10, marginBottom: 40 }}>
            <View style={Styles.TrailsContainer}>
              {this.state.stories.map(
                function(image, index) {
                  return (
                    <View style={Styles.card}>
                      <TouchableOpacity
                        style={Styles.TrailCard}
                        onPress={() => {
                          if (this.state.flag_list[index] == "cont") {
                            this.go_show_cont_story(index);
                          } else {
                            this.go_show_side_story(index);
                          }
                          //  this.forceUpdate();
                        }}
                      >
                        <ImageBackground
                          source={{ uri: image }}
                          // eslint-disable-next-line react-native/no-inline-Styles
                          style={{ width: "100%", height: "100%" }}
                          imageStyle={{
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15
                          }}
                          // resizeMode="stretch"
                        ></ImageBackground>
                        <Text style={Styles.loginText}>
                          {this.state.texts[index]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }.bind(this)
              )}
            </View>
          </ScrollView>
        )}
      </Container>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: "white"
  },
  loginText: {
    fontSize: 17,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    height: 65,
    backgroundColor: "white",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingLeft: 10,
    paddingTop: 10
  },
  TrailsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 20,
    padding: 5
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
    width: screenWidth / 3 - 9,
    height: screenWidth / 3 + 72,
    borderRadius: 15,
    backgroundColor: "lightgray",
    marginBottom: 15,
    padding: 1,
    marginBottom: 20
    // ...elevationShadowStyle(20),
  }
});
