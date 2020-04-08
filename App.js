/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @formatIcon
 * @flow
 */

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from "react-navigation-tabs";

import { YellowBox } from "react-native";
import _ from "lodash";

import React from "react";
import Login from "./components/LoginScreen";
import Signup from "./components/SignUpScreen";
// import Leaderbd from './components/Leaderboard';
// import Urdu from './components/urdu';
import { Example } from "./components/rich";
import Audio from "./components/audio";
// import ImageP from './components/imagepicker';
import ShowStory from "./components/show_story";
import ImageDB from "./components/ImageDB";
import Profile from "./components/Profile";
import other_profile from "./components/other_profile";
import Divide_layout from "./components/Divide_layout";
import Syno from "./components/syno";
import NewStory from "./components/NewStory";
import Home from "./components/Home";
// import Take_title from './components/Take_title';
import draw from "./components/draw";
import search from "./components/search";
import setting from "./components/setting";
import flat_list from "./components/flat_list";
import Followers from "./components/Followers";
import Following from "./components/Following";
import Show_divide from "./components/Show_divide";

import Show_cont_story from "./components/Show_cont_story";
import { Icon } from "react-native-elements";

YellowBox.ignoreWarnings(["Setting a timer"]);
YellowBox.ignoreWarnings(["Warning: ReactNative.createElement"]);
YellowBox.ignoreWarnings([
  "VirtualizedLists should never be nested" // TODO: Remove when fixed
]);

console.disableYellowBox = true;

// const _console = _.clone(console);
// console.warn = message => {
//   if (mess / componentsage.indexOf('Setting a timer') <= -1) {
//     _console.warn(message);
//   }
// };

const Foll = createMaterialTopTabNavigator(
  {
    Followers: { screen: Followers },
    Following: { screen: Following }
  },
  {
    // initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        let { routeName } = navigation.state;
        let iconName;
        if (routeName === "Followers") {
          text = "Followers";
        } else if (routeName === "Following") {
          text = "Following";
        }
        return (
          <Text
          // color={`${tintColor}`}
          // type="font-awesome"
          // name={`${iconName}`}
          // size={25}
          >
            {text}
          </Text>
        );
      }
    }),
    tabBarOptions: {
      style: {
        // marginTop:50,
        backgroundColor: "#F9F9F9"
      },
      activeTintColor: "#ff8000",
      inactiveTintColor: "gray"
    }
    //   headerStyle: {
    //     backgroundColor: 'black'
    // },
  }
);

const Tabs = createBottomTabNavigator(
  {
    Home: { screen: Home },
    NewStory: { screen: NewStory },
    Search: { screen: search },
    Profile: { screen: Profile }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        let { routeName } = navigation.state;
        let iconName;
        if (routeName === "Home") {
          iconName = "home";
        } else if (routeName === "NewStory") {
          iconName = "plus-circle";
        } else if (routeName === "Search") {
          iconName = "search";
        } else if (routeName === "Profile") {
          iconName = "user";
        }
        return (
          <Icon
            color={`${tintColor}`}
            type="font-awesome"
            name={`${iconName}`}
            size={25}
          />
        );
      }
    }),
    tabBarOptions: {
      activeBackgroundColor: "#F9F9F9",
      inactiveBackgroundColor: "#F9F9F9",
      activeTintColor: "#ff8000",
      inactiveTintColor: "gray"
    }
    // headerStyle: {
    // 	backgroundColor: '#43005B'
    // },
  }
  // 	{
  // 	order: ['Home', 'NewStory', 'Profile']
  // },
);

const AppNavigator = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Show_divide: {
      screen: Show_divide
    },
    Rich: {
      screen: Example
    },
    flat_list: {
      screen: flat_list
    },

    Tabs: {
      screen: Tabs
    },
    Foll: {
      screen: Foll
    },
    Divide_layout: {
      screen: Divide_layout
    },
    Signup: {
      screen: Signup
    },
    ShowStory: {
      screen: ShowStory
    },
    Audio: {
      screen: Audio
    },
    ImageDB: {
      screen: ImageDB
    },
    Draw: {
      screen: draw
    },
    Syno: {
      screen: Syno
    },
    other_profile: {
      screen: other_profile
    },
    search: {
      screen: search
    },
    NewStory: {
      screen: NewStory
    },
    Home: {
      screen: Home
    },
    setting: {
      screen: setting
    },
    // Take_title: {
    //   screen: Take_title
    // },
    Show_cont_story: {
      screen: Show_cont_story
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const App = createAppContainer(AppNavigator);

export default App;
