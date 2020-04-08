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
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  Animated,
  StatusBar,
  RefreshControl,
} from 'react-native';

import {Avatar} from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';

import {auth, db, stor} from '../src/config';
import {
  get_usernames,
  get_titles,
  get_title_pic,
  get_story1,
  get_dp,
  get_followers,
  get_following,
} from './data';

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
      n_stories:0,
    };
  }

  go_show_cont_story = async index => {
    var title = this.state.texts[index];
    var username = this.state.username;
    this.props.navigation.navigate('Show_cont_story', {title, username});
  };

  go_show_side_story = async index => {
    console.log('show side')
    var title = this.state.texts[index];
    var username = this.state.username;
    this.props.navigation.navigate('Show_divide', {title, username});
  };

  go_setting = async () => {
    // var title = this.state.texts[index];
    var username = this.state.username;
    var profile_pic = this.state.profile_pic;
    this.props.navigation.navigate('setting', {username, profile_pic});
  };

  go_followers = async () => {
    // console.log('follow');
    var my_username = this.state.username;
    this.props.navigation.navigate('Foll', {my_username});
  };
  async componentDidMount() {
    var dp_url = await get_dp(this.state.username);

    if (dp_url == 0) {
      this.state.profile_pic = 'https://unsplash.it/300/?random';
    } else {
      this.state.profile_pic = dp_url;
    }

    var text = [];
    var images = [];
    var flag_l = [];
    var no_stories=0;

    let title_list = await get_titles(this.state.username);
    if (title_list == null) {
      this.setState({
        loading: false,
      });
      return;
    }
    let titles = Object.keys(title_list);

    // for (var k = 0; k < titles.length; k++) {
     
    // }

    let arr_2d_titles = [];
    for (var i = 0; i < titles.length; i++) {
      text.push(titles[i]);
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

    // console.log('images length:' + images.length);
    // console.log('text length:' + text.length);
    // console.log('flag_l length:' + flag_l.length);
    no_stories=text.length

    var follower_list = await get_followers(this.state.username);
    var n_fs=[];
    if(follower_list==null){
      n_fs=[];
    }else{
      n_fs = Object.keys(follower_list);
    }
    
    
    var following_list = await get_following(this.state.username);
    var n_fing=[]
    if(following_list==null){
      n_fing=[]
    }else{
       n_fing = Object.keys(following_list);

    }

    // flg = 1;
    this.setState({
      stories: images,
      texts: text,
      flag_list: flag_l,
      loading: false,
      n_followers: n_fs.length,
      n_following: n_fing.length,
      n_stories:no_stories
      // flag: flg,
    });

    
  }
 

  render() {
    this.state.username = this.props.navigation.getParam('username');
    let pic_changed = this.props.navigation.getParam('pic_changed');
    let new_pic_url = this.props.navigation.getParam('new_pic_url');

    if (pic_changed == 1) {
      // alert('pic is changed!')
      console.log('changed');
      this.state.profile_pic = new_pic_url;
      // this.forceUpdate();
    }
    let that = this;

    return (
      // <View style = {styles.container}>
      <Container>
        <NavigationEvents
                // onDidFocus={() => Alert.alert('Refreshed')}
        />
        <Header
          style={{paddingLeft: 10, paddingLeft: 10, backgroundColor: '#F9F9F9'}}
          androidStatusBarColor="#F9F9F9"
          iosBarStyle="dark-content">
          <Left>
            <Icon name="md-person-add" />
          </Left>
          <Right>
            <EntypoIcon name="back-in-time" style={{fontSize: 32}} />
          </Right>
        </Header>

        <Content>
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
                      style={{width: 100, height: 100, borderRadius: 50}}
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
                        <TouchableHighlight onPress={() => this.go_followers()}>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>
                            {this.state.n_followers}
                          </Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.go_followers()}>
                          <Text style={{fontSize: 15, color: 'grey'}}>Followers</Text>
                        </TouchableHighlight>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <TouchableHighlight onPress={() => this.go_followers()}>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>
                            {this.state.n_following}
                          </Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.go_followers()}>
                          <Text style={{fontSize: 15, color: 'grey'}}>Following</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                    

                    <View style={{flex: 1, flexDirection: 'row', padding: 15}}>
                    {/** Edit profile takes up 3/4th **/}
                    <Button
                      style = {{
                        flex: 1,
                        height: 35,
                        padding: 20,
                        marginRight: 10,
                        marginLeft: 5,
                        justifyContent: 'center',
                        backgroundColor: '#ff8000',
                      }}
                      // color="yellow"
                      // title='Edit Profile'
                      onPress={that.go_setting}
                    >
                      <Text style = {{color: 'white', fontSize: 15}}> Edit Profile </Text>
                    </Button>
                
                    </View>
                    {/**End edit profile**/}
                  </View>
                </View>

                <View style={{paddingTop: 10, paddingBottom: 10, marginEnd: '83%'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>
                      {this.state.username}
                    </Text>
                </View>
              </View>

              <View
                style={{
                  // flexDirection: 'row',
                  // justifyContent: 'space-around',
                  borderTopWidth: 2,
                  borderTopColor: '#eae5e5',
                }}></View>

        {this.state.loading ? (
                    <Spinner style={{flex: 1, alignSelf: 'center'}} color="#ff8000" />
                  ) : (
                    <>

                <ScrollView style={{marginTop: 10 ,marginBottom: 40,}}>
                  <View style={styles.TrailsContainer}>
                    {this.state.stories.map(
                      function(image, index) {
                        return (
                          <View style={styles.card}>
                            <TouchableOpacity
                              style={styles.TrailCard}
                              onPress={() => {
                                if (this.state.flag_list[index] == 'cont') {
                                  this.go_show_cont_story(index);
                                }else{
                                  this.go_show_side_story(index);
                                }
                                //  this.forceUpdate();
                              }}>
                              <ImageBackground
                                source={{uri: image}}
                                // eslint-disable-next-line react-native/no-inline-styles
                                style={{ width: '100%', height: '100%',}}
                                imageStyle={{ borderTopLeftRadius: 15,
                                  borderTopRightRadius: 15, }}
                                // resizeMode="stretch"
                              ></ImageBackground>
                                <Text style = {styles.loginText}>{this.state.texts[index]}</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      }.bind(this),
                    )}
                  </View>
                </ScrollView>
            </>
          )}
        </Content>

      </Container>
    );
  }
}

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.2 * elevation },
    shadowOpacity: 0.1,
    shadowRadius: 0.4 * elevation
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textinformation: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 220,
    // position: 'absolute',
    bottom: 10,
  },
  loginButton: {
    backgroundColor: '#db3e00',
    elevation: 1000,
    zIndex: 1000
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

