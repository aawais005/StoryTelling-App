import React from 'react';
import {
  Platform,
  Dimensions,
  Linking,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {
  follow_user,
  unfollow_user,
  get_followers,
  get_following,
  get_dp_list,
} from './data.js';

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
  'https://unsplash.it/550/?random',
  'https://unsplash.it/550/?random',
  'https://unsplash.it/550/?random',
];

const textsData = [
  'Awais Ahmed',
  'Awais ',
  'Ahmed',
  'Waleed ',
  'Waleed Malik',
  'Malik',
];

export default class ReactNativeMasonryListExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      follower_names: [],
      follower_images: [],
      my_username: '',
    };
  }

  async componentDidMount() {
    var followers = await get_followers(this.state.my_username);
    if (followers == null) {
      console.log('no followers');
      return;
    }
    let follower_list = Object.keys(followers);

    this.setState({
      follower_names: follower_list,
    });
    var save_list_1 = [];
    let dp_followers = [];
    if (follower_list.length == 1) {
      save_list_1.push(follower_list);
      dp_followers = await get_dp_list(save_list_1);
    } else {
      dp_followers = await get_dp_list(follower_list);
    }
    if (dp_followers == null) {
      return;
    }

    // console.log('list of urls:' + dp_followers);
    this.setState({
      follower_images: dp_followers,
    });
  }

  render() {
    this.state.my_username = this.props.navigation.getParam('my_username');

    return (
      <View style={styles.container}>
        <View style={{marginTop: 10}}>
          <ScrollView style={{marginBottom: 40}}>
            {/* <View style={styles.TrailsContainer}> */}
            {this.state.follower_images.map(
              function(image, index) {
                return (
                  <View style={styles.TrailCard}>
                    <TouchableOpacity>
                      <Image
                        source={{
                          uri: image,
                        }}
                        style={{width: 65, height: 65, borderRadius: 45}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginRight: '55%', fontSize: 15}}>
                      <Text>{this.state.follower_names[index]}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Text>Following</Text>
                    </TouchableOpacity>
                  </View>
                );
              }.bind(this),
            )}
            {/* </View> */}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  userPic: {
    height: 200,
    width: 20,
    borderRadius: 10,
    marginRight: 10,
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
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    maxHeight: 50,
    padding: 10,
    backgroundColor: '#000000b5',
    // borderBottomRightRadius: 8,
    // borderBottomLeftRadius: 8,
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
    // flexDirection: 'column',
    // flexWrap: 'wrap',
    // alignContent: 'center',
    elevation: 15,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 10,
    // backgroundColor: 'yellow'
  },
  TrailCard: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: '4%',
    marginRight: '25%',
    // borderWidth: 3,
    borderColor: '#0000',
    marginBottom: 20,
  },
});
