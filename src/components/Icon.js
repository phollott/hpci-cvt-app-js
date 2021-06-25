import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { gStyle } from '../constants';

const Icon = ({
  name,
  type,
  size,
  color,
  focused,
  reverse,
  solid,
  containerStyle,
  iconStyle
}) => {
  const getBackgroundColor = () => {
    if (reverse) {
      return color;
    }
    return 'transparent';
  };

  const getColor = () => {
    if (reverse) {
      return gStyle.tintColor.active.light;
    }
    if (color !== '') {
      return color;
    }
    return focused
      ? gStyle.tintColor.active.light
      : gStyle.tintColor.inactive.light;
  };

  const buttonStyles = {
    borderRadius: size + 4,
    height: size * 2 + 4,
    width: size * 2 + 4
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        containerStyle && containerStyle,
        reverse && styles.reverseButton,
        reverse && buttonStyles,
        reverse && {
          backgroundColor: getBackgroundColor()
        }
      ])}
    >
      {type === 'material-community' && (
        <MaterialCommunityIcons
          name={name}
          size={size}
          color={getColor()}
          solid={solid}
          style={StyleSheet.flatten([
            { backgroundColor: 'transparent' },
            iconStyle && iconStyle
          ])}
        />
      )}
      {type === 'font-awesome-5' && (
        <FontAwesome5
          name={name}
          size={size}
          color={getColor()}
          solid={solid}
          style={StyleSheet.flatten([
            { backgroundColor: 'transparent' },
            iconStyle && iconStyle
          ])}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reverseButton: {
    margin: 7
  }
});

Icon.defaultProps = {
  type: 'font-awesome-5',
  size: 20,
  color: '',
  focused: true,
  reverse: false,
  solid: false,
  containerStyle: null,
  iconStyle: null
};

Icon.propTypes = {
  // required
  name: PropTypes.string.isRequired,

  // optional
  type: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  focused: PropTypes.bool,
  reverse: PropTypes.bool,
  solid: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ]),
  iconStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ])
};

export default Icon;
