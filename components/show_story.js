import React, {Component} from 'react';
import RNBackgroundDownloader from 'react-native-background-downloader';

import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  I18nManager,
  Button,
  Dimensions,
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);

import WebView from 'react-native-webview';

export default class SignUpScreen extends Component {
  constructor(props) {
    super();
    I18nManager.forceRTL(true);
    this.state = {};
  }

  render() {
    var story_html = this.props.navigation.getParam('st_html');

    const runFirst = `
      {'\u2066'}
      document.body.style.backgroundColor = 'white';
      // setTimeout(function() { window.alert('hi') }, 2000);
      true; // note: this is required, or you'll sometimes get silent failures
    `;
    var htmlContent = '';
    if (story_html == '-1') {
      htmlContent = 'NO STORY HTML';
    } else {
      htmlContent = '<html dir="rtl" ></html>' + story_html;
    }

    // , "<html dir=\"rtl\" lang=\"\"><body>" + outhtml + "</body></html>"
    return (
      //<HTMLView value={htmlContent} stylesheet={styles} />
      <View style={{flex: 1}}>
        <WebView
          dir="rtl"
          scalesPageToFit={false}
          injectedJavaScript={runFirst}
          scrollEnabled={true}
          source={{
            html: htmlContent,
          }}
          style={(styles.container, {marginTop: 20})}
        />
        <View style={styles.nav}></View>
      </View>
      // <WebView
      //   source={{
      //     html: this.props.navigation.getParam('st_html'),
      //   }}
      //   style={{marginTop: 20}}
      // />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'antiquewhite',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonContainer: {
    height: 45,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: screenWidth - 80,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#1e90ff',
  },
  loginText: {
    alignItems: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    // justifyContent: 'space-between',
    // color: 'black',
  },
});
