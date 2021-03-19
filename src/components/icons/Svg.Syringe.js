import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { gStyle } from '../../constants';

const SvgSyringe = ({ active, size }) => {
  const theme = useTheme();
  const fill = active
    ? gStyle.tintColor.active[theme]
    : gStyle.tintColor.inactive[theme];

  return (
    <Svg height={size} width={size} viewBox="0 0 32 32">
      <Path
        d="M28.7,3.3c-0.4-0.4-1-0.4-1.4,0L20,10.6l-1.3-1.3c-0.4-0.4-1-0.4-1.4,0L8,18.6l-2.3-2.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4
	L8.6,22l-4.1,4.1l-0.8-0.8c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l3,3C5.5,29.9,5.7,30,6,30s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4
	l-0.8-0.8l4.1-4.1l4.3,4.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L13.4,24l9.3-9.3c0.4-0.4,0.4-1,0-1.4
	L21.4,12l7.3-7.3C29.1,4.3,29.1,3.7,28.7,3.3z"
        fill={fill}
      />
    </Svg>
  );
};

SvgSyringe.defaultProps = {
  active: false,
  size: 20
};

SvgSyringe.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgSyringe;
