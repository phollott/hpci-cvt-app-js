import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'react-navigation';
import { gStyle } from '../../constants';

const SvgList = ({ active, size }) => {
  const theme = useTheme();
  const fill = active
    ? gStyle.tintColor.active[theme]
    : gStyle.tintColor.inactive[theme];

  return (
    <Svg height={size} width={size} viewBox="0 0 32 32">
      <Path
        d="M24,3H8C5.2,3,3,5.2,3,8v16c0,2.8,2.2,5,5,5h16c2.8,0,5-2.2,5-5V8C29,5.2,26.8,3,24,3z M22,21h-8c-0.6,0-1-0.4-1-1
	s0.4-1,1-1h8c0.6,0,1,0.4,1,1S22.6,21,22,21z M22,17H12c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S22.6,17,22,17z M22,13H10
	c-0.6,0-1-0.4-1-1s0.4-1,1-1h12c0.6,0,1,0.4,1,1S22.6,13,22,13z"
        fill={fill}
      />
    </Svg>
  );
};

SvgList.defaultProps = {
  active: false,
  size: 20
};

SvgList.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgList;
