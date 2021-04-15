import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { gStyle } from '../constants';

const HomeMenu = ({ navigation, route }) => (
  <TouchableOpacity
    accessible
    accessibilityLabel="menu"
    accessibilityComponentType="button"
    accessibilityTraits="button"
    activeOpacity={gStyle.activeOpacity}
    onPress={() => {
      navigation.navigate('HomeStack', {screen: 'Menu'})
    }}
    style={{ paddingLeft: 16, paddingRight: 8, paddingVertical: 8 }}
  >
    <Icon
      name='bars'
      type='font-awesome-5'
      size={20}
      color={
        (true === true) ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
      }
    />
  </TouchableOpacity>
);

HomeMenu.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default HomeMenu;
