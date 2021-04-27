import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { gStyle } from '../constants';
import Icon from './Icon';

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
    <Icon name='bars' />
  </TouchableOpacity>
);

HomeMenu.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default HomeMenu;
