import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { gStyle } from '../constants';

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
      name='chevron-left'
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
