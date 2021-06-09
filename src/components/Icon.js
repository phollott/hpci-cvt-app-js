import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon as IconRNE} from 'react-native-elements';
import { gStyle } from '../constants';

const Icon = ({name, type = 'font-awesome-5', size = 20, color = '', focused = true, reverse = false, solid = false, style}) => (
  <IconRNE
    name={name}
    type={type}
    size={size}
    color={
      color !== '' ? color : (focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light)
    }
    reverse={reverse}
    solid={solid}
    style={style}
  />
);

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
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ])
};

export default Icon;
