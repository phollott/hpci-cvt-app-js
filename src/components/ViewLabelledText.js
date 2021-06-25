import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

export default class ViewLabelledText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { text, label } = this.props;
    return (
      <View style={{ padding: 3 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{text}</Text>
        <Text style={{ fontSize: 9 }}>{label}</Text>
      </View>
    );
  }
}

ViewLabelledText.propTypes = {
  // required
  text: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};
