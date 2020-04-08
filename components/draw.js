import React, {Component} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import SketchDraw from 'react-native-sketch-draw';

import RNfetchBlob from 'react-native-fetch-blob';

import {uploadImage} from './data';
const fs = RNfetchBlob.fs;
const SketchDrawConstants = SketchDraw.constants;

// var glob_url = 'nothing';
const tools = {};

tools[SketchDrawConstants.toolType.pen.id] = {
  id: SketchDrawConstants.toolType.pen.id,
  name: SketchDrawConstants.toolType.pen.name,
  nextId: SketchDrawConstants.toolType.eraser.id,
};
tools[SketchDrawConstants.toolType.eraser.id] = {
  id: SketchDrawConstants.toolType.eraser.id,
  name: SketchDrawConstants.toolType.eraser.name,
  nextId: SketchDrawConstants.toolType.pen.id,
};

export default class DrawBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#FFFFFF',
      toolSelected: SketchDrawConstants.toolType.pen.id,
      glob_url: '',
      draw_check: 0,
      username: '',
      title: '',
    };
  }

  isEraserToolSelected() {
    return this.state.toolSelected === SketchDrawConstants.toolType.eraser.id;
  }

  toolChangeClick() {
    this.setState({toolSelected: tools[this.state.toolSelected].nextId});
  }

  getToolName() {
    return tools[this.state.toolSelected].name;
  }

  onSketchSave(saveEvent) {
    // console.log('loc:' + saveEvent.localFilePath);
    this.props.onSave && this.props.onSave(saveEvent);
    var db_image_upload = uploadImage(
      this.state.username,
      this.state.title,
      'cont',
      saveEvent.localFilePath,
    ).then(returned => {
      // console.log('returend' + returned);
      // this.state.glob_url = returned;
      this.setState({glob_url: returned});
      this.setState({draw_check: 1});
    });
  }
  render() {
    this.state.title = this.props.navigation.getParam('title');
    this.state.username = this.props.navigation.getParam('username');
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <SketchDraw
          style={{flex: 1, backgroundColor: 'white'}}
          ref="sketchRef"
          selectedTool={this.state.toolSelected}
          toolColor={'#ff0000'}
          onSaveSketch={this.onSketchSave.bind(this)}
          localSourceImagePath={this.props.localSourceImagePath}
        />

        <View style={{flexDirection: 'row', backgroundColor: '#EEE'}}>
          <TouchableHighlight
            underlayColor={'#CCC'}
            style={{flex: 1, alignItems: 'center', paddingVertical: 20}}
            onPress={() => {
              this.props.navigation.navigate('Rich', {
                glob_url: this.state.glob_url,
                draw_check: this.state.draw_check,
              });
            }}>
            <Text style={{color: '#888', fontWeight: '600'}}>DONE</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'#CCC'}
            style={{flex: 1, alignItems: 'center', paddingVertical: 20}}
            onPress={() => {
              this.refs.sketchRef.clearSketch();
            }}>
            <Text style={{color: '#888', fontWeight: '600'}}>CLEAR</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'#CCC'}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 20,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: '#DDD',
            }}
            onPress={() => {
              this.refs.sketchRef.saveSketch();
            }}>
            <Text style={{color: '#888', fontWeight: '600'}}>SAVE</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={'#CCC'}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.isEraserToolSelected()
                ? '#CCC'
                : 'rgba(0,0,0,0)',
            }}
            onPress={this.toolChangeClick.bind(this)}>
            <Text style={{color: '#888', fontWeight: '600'}}>ERASER</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
