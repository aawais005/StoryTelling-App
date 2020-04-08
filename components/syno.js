import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import Accordian from './Accordian.js';
import {Colors} from './Colors';
const dic_json = require('./ansj.json');

// var output_diction = '';
import {
  Button,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ScrollView,
} from 'react-native';

// var fs = require('react-native-fs');
export default class syno extends Component {
  constructor(props) {
    super();
    global.list = {};
    this.state = {
      dic_html: '',
      func_html: '',
      list_info: [],
      replaced_html: '',
      menu: [
        // {
        //   title: 'Non Veg Biryanis',
        //   data: [
        //     {key: 'Mutton Biryani', value: false},
        //     {key: 'Prawns Biryani', value: false},
        //   ],
        //   sentences: ['bro', 'vor sjs'],
        // },
      ],
    };
  }
  async componentDidMount() {
    this.setState({
      func_html: this.state.dic_html,
    });
    this.myfunc();
  }

  readFile = async MyPath => {
    try {
      const path = MyPath + '/ans.txt';
      const contents = await RNFS.readFile(path, 'utf8');
      return '' + contents;
    } catch (e) {
      alert('' + e);
    }
  };

  getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
      return [];
    }
    var startIndex = 0,
      index,
      indices = [];
    if (!caseSensitive) {
      str = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (var i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  rep_dob(diction_dob, story_html) {
    var temp_html = story_html;
    // new_html = ``;
    for (var i = 0; i < diction_dob.length; i++) {
      var orig_word = diction_dob[i][0];
      var reg_rep = new RegExp(orig_word, 'g');
      temp_html = temp_html.replace(reg_rep, diction_dob[i][1][0]);
    }
    // console.log(temp_html);
    return temp_html;
  }

  rep_html(diction_dob, story_html) {
    var temp_html = story_html;
    for (var i = 0; i < diction_dob.length; i++) {
      var orig_word = diction_dob[i][0];
      var reg_rep = new RegExp(orig_word, 'g');
      temp_html = temp_html.replace(reg_rep, diction_dob[i][1]);
    }
    // console.log(temp_html);
    return temp_html;
  }

  replace_single(diction_single, story_html) {
    var temp_html = story_html;
    // new_html = ``;
    for (var i = 0; i < diction_single.length; i++) {
      var orig_word = diction_single[i][0];
      if (orig_word.length > 2 && orig_word != 'میں' && orig_word != 'بھی') {
        var reg_rep = new RegExp(orig_word, 'g');
        temp_html = temp_html.replace(reg_rep, diction_single[i][2][0]);
      }
    }
    // console.log(temp_html);
    return temp_html;
  }

  make_plain_text(html) {
    let plain_text = html.replace(/<[^>]+>/g, '');
    return plain_text;
  }

  text_split_words(my_plain_text) {
    var split_words_list = my_plain_text.split(
      /[ ،۔\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/,
    );
    return split_words_list;
  }

  copy_list_all_sing_words(list_words) {
    var copied_list = [];
    for (var i = 0; i < list_words.length; i++) {
      copied_list.push([list_words[i]]);
    }
    return copied_list;
  }

  make_double_word_list(list_of_words, list_words_final) {
    var double_word_list = [];
    for (var i = 0; i < list_of_words.length; i++) {
      double_word_list.push([
        list_of_words[i] + ' ' + list_of_words[i + 1],
        i,
        i + 1,
      ]);
    }
    double_word_list.splice(list_words_final.length - 1, 1);

    return double_word_list;
  }

  make_diction(json_dic, word_list) {
    var diction = [];
    for (var i = 0; i < word_list.length; i++) {
      var mean_i = json_dic[word_list[i][0]];
      if (mean_i != undefined) {
        diction.push([
          word_list[i][0],
          mean_i,
          // i
        ]);
      }
    }
    return diction;
  }

  give_start_end_dot(word_index, plain_or_html, html_len) {
    var start_dot = word_index;
    var a = plain_or_html[start_dot];
    while (a != '.' && a != '۔' && start_dot >= 0) {
      start_dot = start_dot - 1;
      a = plain_or_html[start_dot];
    }

    var end_dot = word_index + html_len;
    a = plain_or_html[end_dot];
    while (a != '.' && a != '۔' && end_dot <= plain_or_html.length) {
      end_dot = end_dot + 1;
      a = plain_or_html[end_dot];
    }
    return [start_dot, end_dot];
  }

  double_word_index_rem(plain_indices_d, forbidden_indexes) {
    var temp_plain_ind = [];
    var checker = 0;
    for (var t = 0; t < plain_indices_d.length; t++) {
      for (var u = 0; u < forbidden_indexes.length; u++) {
        if (plain_indices_d[t] == forbidden_indexes[u]) {
          checker = 1;
        }
      }
      if (checker == 0) {
        temp_plain_ind.push(plain_indices_d[t]);
      } else {
        checker = 0;
      }
    }
    return temp_plain_ind;
  }

  grammar_word(urdu_word) {
    var gr_list = ['میں', 'بھی'];
    if (gr_list.includes(urdu_word)) {
      // alert('yes');
      return 1;
    } else {
      return 0;
    }
  }

  push_in_menu(word, list_synos, list_sentences) {
    var list_syno_dic = [];
    var temp_list_syno = list_synos;
    for (var z = 0; z < temp_list_syno.length; z++) {
      var temp_syno_dic = {key: temp_list_syno[z], value: false};
      list_syno_dic.push(temp_syno_dic);
    }
    var temp_dict = {
      title: word,
      sentences: list_sentences,
      data: list_syno_dic,
    };
    this.state.menu.push(temp_dict);
  }

  myfunc() {
    console.log('-----');
    var story_html = ``;
    story_html = this.state.dic_html;
    let plainText = this.make_plain_text(story_html);
    var text_split_temp = this.text_split_words(plainText);
    var text_split_final = this.copy_list_all_sing_words(text_split_temp);
    var text_split_final_d = this.make_double_word_list(
      text_split_temp,
      text_split_final,
    );
    // fs.readFile('ans.txt', 'utf8', function read(err, data) {
    var result = dic_json;
    var diction = this.make_diction(result, text_split_final_d);
    // for (i = 0; i < diction.length; i++) {
    //   // console.log(diction[i]);
    // }
    diction = this.removeDuplicates(diction, 0);

    var forbidden_indexes = [];
    var output_diction = '';
    for (var i = 0; i < diction.length; i++) {
      // output_diction =
      //   output_diction +
      //   '<b>' +
      //   diction[i][0] +
      //   '</b>' +
      //   ':' +
      //   diction[i][1] +
      //   '<br />';

      var plain_indices = this.getIndicesOf(diction[i][0], plainText);
      //   console.log('word:' + diction[i][0]);
      // console.log("plain indeces:" + plain_indices);
      var word_sentences = [];
      for (var j = 0; j < plain_indices.length; j++) {
        for (var k = 0; k < diction[i][0].length; k++) {
          forbidden_indexes.push(plain_indices[j] + k);
        }

        var start_end_plain = this.give_start_end_dot(
          plain_indices[j],
          plainText,
          diction[i][0].length,
        );
        var start_dot = start_end_plain[0];
        var end_dot = start_end_plain[1];
        // console.log(plainText.substring(start_dot + 1, end_dot + 1));
        var sentence = plainText.substring(start_dot + 1, end_dot + 1);
        // output_diction = output_diction + sentence + '<br />';
        word_sentences.push(sentence);
      }

      this.push_in_menu(diction[i][0], diction[i][1], word_sentences);
    }

    // var changed_dob_html = this.rep_dob(diction, story_html);
    //replace double
    var diction_s = this.make_diction(result, text_split_final);

    diction_s = this.removeDuplicates(diction_s, 0);

    var diction_s_ind = [];
    for (var d = 0; d < diction_s.length; d++) {
      var plain_indices_d = this.getIndicesOf(diction_s[d][0], plainText);
      var temp_plain_ind = this.double_word_index_rem(
        plain_indices_d,
        forbidden_indexes,
      );
      // temp_html_indices = [];
      diction_s_ind.push([diction_s[d][0], temp_plain_ind, diction_s[d][1]]);
    }

    for (var z = 0; z < diction_s_ind.length; z++) {
      // console.log('word:' + diction_s_ind[z][0]);
      var sing_word = diction_s_ind[z][0];
      if (this.grammar_word(sing_word) || sing_word.length <= 2) {
        continue;
      }
      var sing_synos = diction_s_ind[z][2];
      // output_diction =
      //   output_diction +
      //   '<b>' +
      //   sing_word +
      //   '</b>' +
      //   ':' +
      //   sing_synos +
      //   '<br />';
      var counter = 0;
      var pair_st_end = [];
      var sing_sentences = [];
      for (var n = 0; n < diction_s_ind[z][1].length; n++) {
        var start_end_plain_sing = this.give_start_end_dot(
          diction_s_ind[z][1][n],
          plainText,
          diction_s_ind[z][0].length,
        );
        var st_sen = start_end_plain_sing[0];
        var end_sen = start_end_plain_sing[1];

        var bool_check = 0;
        for (var b = 0; b < pair_st_end.length; b++) {
          if (st_sen == pair_st_end[b][0] && end_sen == pair_st_end[b][1]) {
            bool_check = 1;
          }
        }
        counter = counter + 1;

        pair_st_end.push([st_sen, end_sen]);
        if (bool_check == 0) {
          // if (counter <= 1) {
          var sing_sentence = plainText.substring(st_sen + 1, end_sen + 1);
          // output_diction = output_diction + sing_sentence + '<br />';
          sing_sentences.push(sing_sentence);
          // console.log(plainText.substring(st_sen + 1, end_sen + 1));
          // }
        } else {
          bool_check = 0;
        }
      }
      this.push_in_menu(sing_word, sing_synos, sing_sentences);
      // this.state.list_info.push(sing_word, sing_synos, sing_sentences);
    }
    // var new_single_html = this.replace_single(diction_s_ind, story_html);
    // this.props.navigation.navigate('ShowStory', {st_html: output_diction});
  }

  render() {
    this.state.dic_html = this.props.navigation.getParam('dic_html');
    return (
      <View style={styles.container}>
        <Button title="Done" onPress={this.go_to_rich} />
        <ScrollView>{this.renderAccordians()}</ScrollView>
      </View>
    );
  }

  renderAccordians = () => {
    // console.log(this.state.menu[0]);
    var items = [];

    for (var item of this.state.menu) {
      items.push(
        <Accordian
          title={item.title}
          data={item.data}
          sentences={item.sentences}
        />,
      );
    }
    return items;
  };

  go_to_rich = async () => {
    var html_to_send = this.state.dic_html;
    var list_to_send = [];
    var my_dict = global.list;
    for (var key in my_dict) {
      var value = my_dict[key];
      var temp_list = [key, value];
      list_to_send.push(temp_list);
    }
    console.log(list_to_send);
    // var html_to_send = this.richText.getContentHtml();
    this.state.replaced_html = this.rep_html(list_to_send, html_to_send);
    // alert(this.state.replaced_html);

    this.props.navigation.navigate('Rich', {
      // list_synonyms: global.list,
      syno_check: 1,
      replaced_html: this.state.replaced_html,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: Colors.PRIMARY,
  },
});
