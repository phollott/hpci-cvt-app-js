import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { gStyle } from '../constants';

const HomeMenu = ({ navigation }) => (
  <TouchableOpacity
    accessible
    accessibilityLabel="menu"
    accessibilityComponentType="button"
    accessibilityTraits="button"
    activeOpacity={gStyle.activeOpacity}
    onPress={() => {
      navigation.dispatch(DrawerActions.toggleDrawer());
    }}
    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
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
  navigation: PropTypes.object.isRequired
};

export default HomeMenu;
