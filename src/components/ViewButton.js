import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../constants';

export default class ViewButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      text,
      icon,
      onPress,
      disabled,
      labelStyle,
      mode,
      style,
      uppercase
    } = this.props;
    return (
      <View style={styles.container}>
        <Button
          icon={icon}
          onPress={onPress}
          disabled={disabled}
          labelStyle={labelStyle}
          mode={mode}
          style={style}
          uppercase={uppercase}
        >
          <Text>{text}</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  defaultButton: {
    backgroundColor: colors.lightGrey,
    borderRadius: 20,
    width: '90%'
  },
  defaultLabel: {
    color: colors.green,
    fontSize: 12,
    fontWeight: 'bold'
  }
});

ViewButton.defaultProps = {
  icon: null,
  onPress: () => {},
  disabled: false,
  labelStyle: styles.defaultLabel,
  mode: 'contained',
  style: styles.defaultButton,
  uppercase: false
};

ViewButton.propTypes = {
  // required
  text: PropTypes.string.isRequired,

  // optional
  icon: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  labelStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ]),
  mode: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ]),
  uppercase: PropTypes.bool
};
