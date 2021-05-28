import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class ViewLabelledText extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (  
      <View style={{ padding: 3 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{ this.props.text }</Text>
        <Text style={{ fontSize: 9 }}>{ this.props.label }</Text>
      </View>
    );
  }
}
