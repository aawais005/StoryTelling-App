import React from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  I18nManager,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

import {Avatar} from 'react-native-elements';

import {auth, db, stor} from '../src/config';
import {
  get_usernames,
  get_titles,
  get_title_pic,
  get_story1,
  check_user,
} from './data';

import {
  follow_user,
  unfollow_user,
  get_followers,
  get_following,
  get_dp_list,
  get_dp,
} from './data.js';

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
  Spinner,
} from 'native-base';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const screenWidth = Dimensions.get('window').width;

const images = [
  'https://unsplash.it/300/?random',
  'https://unsplash.it/350/?random',
  'https://unsplash.it/400/?random',
  'https://unsplash.it/450/?random',
  'https://unsplash.it/500/?random',
  'https://unsplash.it/550/?random',
  'https://unsplash.it/600/?random',
  'https://unsplash.it/550/?random',
  'https://unsplash.it/550/?random',
  'https://unsplash.it/550/?random',
];

export default class Profile extends React.Component {
  constructor() {
    super();
    // I18nManager.forceRTL(true);
    this.state = {
      caught_query: '',
      user_shown: '',
      curr_username: '',
      username: '',
      //Assing a array to your pokeList state
      stories: [],
      //Have a loading state where when data retrieve returns data.
      loading: true,
      // loc_stories: [],
      texts: [],
      flag_list: [],
      //Have a loading state where when data retrieve returns data.
      flag: 0,
      activeIndex: 0,
      profile_pic: '',
      n_followers: 0,
      n_following: 0,
      n_stories: 0,
      follow_status: '',
    };
  }

  go_show_cont_story = async index => {
    var title = this.state.texts[index];
    var username = this.state.username;
    this.props.navigation.navigate('Show_cont_story', {title, username});
  };

  follow_user = async () => {
    if (this.state.follow_status == 'Follow') {
      await follow_user(this.state.curr_username, this.state.username);
      this.setState({
        follow_status: 'Following',
      });
    } else {
      await unfollow_user(this.state.curr_username, this.state.username);
      this.setState({
        follow_status: 'Follow',
      });
    }
  };

  follow_person = async () => {
    await follow_user(this.state.curr_username, this.state.username);
  };

  async componentDidMount() {
    // var u_flag = await check_user(this.state.caught_query);
    // console.log('yee');
    // if (u_flag == '0') {
    //   console.log('yee1');

    //   alert('No user of this name exists');
    //   return;
    // } else {
    //   this.state.username = this.state.caught_query;
    //   // return;
    // }
    var text = [];
    var images = [];
    var flag_l = [];
    var no_stories = 0;
    var dp_url_o = await get_dp(this.state.username);

    if (dp_url_o == 0) {
      this.state.profile_pic = 'https://unsplash.it/300/?random';
    } else {
      this.state.profile_pic = dp_url_o;
    }

    let title_list = await get_titles(this.state.username);
    if (title_list == null) {
      this.setState({
        loading: false,
      });
      return;
    }
    let titles = Object.keys(title_list);
    no_stories = titles.length;

    for (var k = 0; k < titles.length; k++) {
      text.push(titles[k]);
    }

    let arr_2d_titles = [];
    for (var i = 0; i < titles.length; i++) {
      arr_2d_titles[i] = title_list[titles[i]];
    }

    for (var a = 0; a < arr_2d_titles.length; a++) {
      let title_pic_list = await get_title_pic(
        arr_2d_titles[a][0],
        arr_2d_titles[a][1],
      );

      var pic_url = title_pic_list[2];
      images.push(pic_url);
      flag_l.push(arr_2d_titles[a][2]);
    }

    console.log('images length:' + images.length);
    console.log('text length:' + text.length);
    console.log('flag_l length:' + flag_l.length);

    var fol_stat = '';
    var n_fs = [];

    var follower_list = await get_followers(this.state.username);
    if (follower_list == null) {
      n_fs = [];
      fol_stat = 'Follow';
    } else {
      var fol_stat = '';
      var n_fs = Object.keys(follower_list);
      if (follower_list[this.state.curr_username] != undefined) {
        fol_stat = 'Following';
        console.log('I follow this user!');
      } else {
        fol_stat = 'Follow';
        console.log('dont follow this user!');
      }
    }
    var n_fing = [];
    var following_list = await get_following(this.state.username);
    if (follower_list == null) {
      n_fing = [];
    } else {
      var n_fing = Object.keys(following_list);
    }
    // flg = 1;
    this.setState({
      stories: images,
      texts: text,
      flag_list: flag_l,
      loading: false,
      n_followers: n_fs.length,
      n_following: n_fing.length,
      n_stories: no_stories,
      follow_status: fol_stat,
      // flag: flg,
    });
  }

  render() {
    this.state.caught_query = this.props.navigation.getParam('query');
    this.state.curr_username = this.props.navigation.getParam('curr_username');
    this.state.username = this.state.caught_query;

    return (
      // <View style = {styles.container}>
      <Container>
        <Header
          style={{paddingLeft: 10, paddingLeft: 10, backgroundColor: '#43005B'}}
          androidStatusBarColor="#43005B">
          <Left>
            <Icon name="md-person-add" />
          </Left>
          <Right>
            <EntypoIcon name="back-in-time" style={{fontSize: 32}} />
          </Right>
        </Header>
        <Content>
          {this.state.loading ? (
            <Spinner style={{flex: 1, alignSelf: 'center'}} color="#43005B" />
          ) : (
            <>
              <View style={{paddingTop: 10}}>
                {/** User Photo Stats**/}
                <View style={{flexDirection: 'row'}}>
                  {/**User photo takes 1/3rd of view horizontally **/}
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Image
                      source={{
                        uri: this.state.profile_pic,
                      }}
                      style={{width: 85, height: 85, borderRadius: 39.5}}
                    />
                  </View>

                  {/**User Stats take 2/3rd of view horizontally **/}
                  <View style={{flex: 3}}>
                    {/** Stats **/}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'flex-end',
                      }}>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>
                          {this.state.n_stories}
                        </Text>
                        <Text style={{fontSize: 15, color: 'grey'}}>
                          Stories
                        </Text>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>
                          {this.state.n_followers}
                        </Text>
                        <Text style={{fontSize: 15, color: 'grey'}}>
                          Followers
                        </Text>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>
                          {this.state.n_following}
                        </Text>
                        <Text style={{fontSize: 15, color: 'grey'}}>
                          Following
                        </Text>
                      </View>
                    </View>

                    {/**Edit profile and Settings Buttons **/}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingTop: 10,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        {/** Edit profile takes up 3/4th **/}
                        <Button
                          bordered
                          dark
                          style={{
                            flex: 3,
                            marginLeft: 10,
                            justifyContent: 'center',
                            height: 30,
                            backgroundColor: '#cc31cc',
                          }}
                          onPress={this.follow_user}>
                          <Text style={{color: 'white'}}>
                            {this.state.follow_status}
                          </Text>
                        </Button>

                        {/** Settings takes up  1/4th place **/}
                        {/* <Button
                          bordered
                          dark
                          style={{
                            flex: 1,
                            height: 30,
                            marginRight: 10,
                            marginLeft: 5,
                            justifyContent: 'center',
                          }}>
                          <Icon name="settings" style={{color: 'black'}}></Icon>
                        </Button> */}
                      </View>
                    </View>
                    {/**End edit profile**/}
                  </View>
                </View>

                <View style={{paddingBottom: 10}}>
                  <View style={{paddingHorizontal: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                      {this.state.username}
                    </Text>
                    {/* <Text style={{fontSize: 15}}>
                      Lark | Computer Jock | Commercial Pilot
                    </Text>
                    <Text style={{fontSize: 15}}>www.unsureprogrammer.com</Text> */}
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  borderTopWidth: 1,
                  borderTopColor: '#eae5e5',
                }}></View>

              <View style={{marginTop: 10}}>
                <ScrollView style={{marginBottom: 40}}>
                  <View style={styles.TrailsContainer}>
                    {this.state.stories.map(
                      function(image, index) {
                        return (
                          // <View style={styles.TrailCard}>
                          <TouchableOpacity
                            style={styles.TrailCard}
                            onPress={() => {
                              if (this.state.flag_list[index] == 'cont') {
                                this.go_show_cont_story(index);
                              }
                              //  this.forceUpdate();
                            }}>
                            <ImageBackground
                              source={{uri: image}}
                              // eslint-disable-next-line react-native/no-inline-styles
                              style={{width: '100%', height: '100%'}}
                              imageStyle={styles.CardImage}
                              resizeMode="stretch"></ImageBackground>
                            <Text>{this.state.texts[index]}</Text>
                          </TouchableOpacity>
                          // </View>
                        );
                      }.bind(this),
                    )}
                  </View>
                </ScrollView>
              </View>
            </>
          )}
        </Content>
        {/* </View> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: 'white',
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
  scroll: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    height: '40%',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 15,
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
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  TrailNameHolder: {
    // padding: 13,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    maxHeight: 50,
    padding: 10,
    backgroundColor: '#000000b5',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  TrailName: {
    color: 'white',
    fontSize: 16,
  },
  TrailsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    elevation: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  TrailCard: {
    width: screenWidth / 3 - 4,
    height: screenWidth / 3,
    borderWidth: 3,
    borderColor: '#fff',
    // borderRadius: 10,
    marginBottom: 20,
  },
});
