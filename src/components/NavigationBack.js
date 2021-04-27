import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { gStyle } from '../constants';
import Icon from './Icon';

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
    <Icon name='chevron-left' />
  </TouchableOpacity>
);

NavigationBack.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default NavigationBack;
