import React, {Component} from 'react';
import {View, TouchableOpacity, Text, FlatList, StyleSheet} from 'react-native';
import {Colors} from './Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Highlighter from 'react-native-highlight-words';

var text = ['boss', 'bor'];

export default class Accordian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
      l_sentences: props.sentences,
      list_ex: [],
    };
  }

  render() {
    var list_sentences = '';
    var p_sent = this.state.l_sentences;
    for (var i = 0; i < p_sent.length; i++) {
      list_sentences = list_sentences + p_sent[i] + '\n';
    }
    var list_word = [this.props.title];
    // console.log(this.props.m_string);
    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.toggleExpand()}>
          <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
          <Icon
            name={
              this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
            }
            size={30}
            color={Colors.DARKGRAY}
          />
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View style={{}}>
            <Text style={[styles.title, styles.font]}>
              <Highlighter
                highlightStyle={{backgroundColor: 'yellow'}}
                searchWords={list_word}
                textToHighlight={list_sentences}
              />
            </Text>
            <FlatList
              data={this.state.data}
              numColumns={1}
              scrollEnabled={false}
              renderItem={({item, index}) => (
                <View>
                  <TouchableOpacity
                    style={[
                      styles.childRow,
                      styles.button,
                      item.value ? styles.btnActive : styles.btnInActive,
                    ]}
                    onPress={() =>
                      this.onClick(index, this.props.title, this.props.data)
                    }>
                    <Text style={[styles.font, styles.itemInActive]}>
                      {item.key}
                    </Text>
                    <Icon
                      name={'check-circle'}
                      size={24}
                      color={item.value ? Colors.Green : Colors.LIGHTGRAY}
                    />
                  </TouchableOpacity>
                  <View style={styles.childHr} />
                </View>
              )}
            />
          </View>
        )}
      </View>
    );
  }

  onClick = (index, item, syno) => {
    const temp = this.state.data.slice();

    var syno_len = temp.length;
    // console.log(syno_len)
    for (var i = 0; i < syno_len; i++) {
      if (i != index) {
        temp[i].value = false;
      }
    }

    temp[index].value = !temp[index].value;
    // console.log(
    //   index + ',' + item + ',' + syno[index].key + ',' + temp[index].value,
    // );
    if (temp[index].value == false) {
      // console.log('yes');
      delete global.list[item];
    } else {
      global.list[item] = syno[index].key;
    }

    this.setState({data: temp});
    // console.log(global.list);
  };

  toggleExpand = () => {
    this.setState({expanded: !this.state.expanded});
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  font: {
    // fontFamily: Fonts.bold,
  },
  button: {
    width: '100%',
    height: 54,
    alignItems: 'center',
    paddingLeft: 35,
    paddingRight: 35,
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.DARKGRAY,
  },
  itemActive: {
    fontSize: 12,
    color: Colors.GREEN,
  },
  itemInActive: {
    fontSize: 12,
    color: Colors.DARKGRAY,
  },
  btnActive: {
    borderColor: Colors.GREEN,
  },
  btnInActive: {
    borderColor: Colors.DARKGRAY,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: 'center',
    backgroundColor: Colors.CGRAY,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.GRAY,
  },
  parentHr: {
    height: 1,
    color: Colors.WHITE,
    width: '100%',
  },
  childHr: {
    height: 1,
    backgroundColor: Colors.LIGHTGRAY,
    width: '100%',
  },
  colorActive: {
    borderColor: Colors.GREEN,
  },
  colorInActive: {
    borderColor: Colors.DARKGRAY,
  },
});
