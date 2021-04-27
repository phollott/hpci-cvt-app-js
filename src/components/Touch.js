import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { gStyle } from '../constants';
import Icon from './Icon';

const Touch = ({ accessible, onPress, style, text, textStyle, rIconName }) => (
  <TouchableOpacity
    accessible={accessible}
    activeOpacity={gStyle.activeOpacity}
    onPress={onPress}
    style={style}
  >
    <View style={{flexDirection:"row"}}>
      <Text style={textStyle}>{text}</Text>
      { (rIconName !== null) &&
          <Icon name={rIconName} color={gStyle.text.dark.color} style={{paddingLeft: 20}} />
      }
    </View>
  </TouchableOpacity>
);

Touch.defaultProps = {
  accessible: true,
  style: gStyle.btn,
  textStyle: gStyle.btnText,
  rIconName: null
};

Touch.propTypes = {
  // required
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,

  // optional
  accessible: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ]),
  textStyle: PropTypes.object
};

export default Touch;
