import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { gStyle } from '../constants';

// icons
//import SvgCircleLeft from './icons/Svg.CircleLeft';
// [mrj] <SvgCircleLeft active /> would not render after react nav 5 upgrade, so replaced with icon

const NavigationBack = ({ navigation, route }) => (
  <TouchableOpacity
    accessible
    accessibilityLabel="go back"
    accessibilityComponentType="button"
    accessibilityTraits="button"
    activeOpacity={gStyle.activeOpacity}
    onPress={() => navigation.goBack(route.key)}
    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
  >
    <Icon
      name='arrow-alt-circle-left'
      type='font-awesome-5'
      size={20}
      color={
        (true === true) ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
      }
    />
  </TouchableOpacity>
);

NavigationBack.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default NavigationBack;
