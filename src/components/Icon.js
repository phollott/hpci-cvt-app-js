import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon as IconRNE} from 'react-native-elements';
import { gStyle } from '../constants';

const Icon = ({name, size = 20, color = '', focused = true, reverse = false, style}) => (
  <IconRNE
    name={name}
    type='font-awesome-5'
    size={size}
    color={
      color !== '' ? color : (focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light)
    }
    reverse={reverse}
    style={style}
  />
);

Icon.propTypes = {
  // required
  name: PropTypes.string.isRequired,

  // optional
  size: PropTypes.number,
  color: PropTypes.string,
  focused: PropTypes.bool,
  reverse: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object
  ])
};

export default Icon;
