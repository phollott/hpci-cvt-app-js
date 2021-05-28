import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { gStyle } from '../constants';

export default class ViewCardText extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <View contentContainerStyle={gStyle.contentContainer}>
        <Card>
          <Text style={{fontSize: 16}}>{ this.props.text }</Text>
        </Card>
      </View>
    );
  }
}
