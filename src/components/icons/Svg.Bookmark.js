import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'react-navigation';
import { colors } from '../../constants';

const SvgBookmark = ({ active, size }) => {
  const theme = useTheme();
  const fill = active
    ? colors.activeTintColor[theme]
    : colors.inactiveTintColor[theme];

  return (
    <Svg height={size} width={size} viewBox="0 0 32 32">
      <Path
        d="M22,4H10A3,3,0,0,0,7,7V25.29a2.47,2.47,0,0,0,1.29,2.19,2.47,2.47,0,0,0,2.54-.07l4.91-3.07a.5.5,0,0,1,.53,0l4.91,3.07A2.5,2.5,0,0,0,25,25.29V7A3,3,0,0,0,22,4ZM19.5,14.5H17V17a1,1,0,0,1-2,0V14.5H12.5a1,1,0,0,1,0-2H15V10a1,1,0,0,1,2,0v2.5h2.5a1,1,0,0,1,0,2Z"
        fill={fill}
      />
    </Svg>
  );
};

SvgBookmark.defaultProps = {
  active: false,
  size: 20
};

SvgBookmark.propTypes = {
  // optional
  active: PropTypes.bool,
  size: PropTypes.number
};

export default SvgBookmark;
