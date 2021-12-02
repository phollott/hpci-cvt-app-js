import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native-paper';
import { colors } from '../constants';

export default class ViewSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      text,
      value,
      onValueChange,
      switchColor,
      switchStyle,
      textStyle
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={textStyle}>{text}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          color={switchColor}
          style={switchStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%'
  },
  defaultSwitch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }]
  },
  defaultText: {
    color: colors.darkColor,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

ViewSwitch.defaultProps = {
  onValueChange: () => {},
  switchColor: colors.darkColor,
  switchStyle: styles.defaultSwitch,
  textStyle: styles.defaultText
};

ViewSwitch.propTypes = {
  // required
  text: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,

  // optional
  onValueChange: PropTypes.func,
  switchColor: PropTypes.string,
  switchStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ])
};
