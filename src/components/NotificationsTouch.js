import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { gStyle } from '../constants';
import Icon from './Icon';
import { getTimeInMillis } from '../shared/date-fns';

const NotificationsTouch = ({ navigation, route }) => (
  <TouchableOpacity
    accessible
    accessibilityLabel="notifications"
    accessibilityComponentType="button"
    accessibilityTraits="button"
    activeOpacity={gStyle.activeOpacity}
    onPress={() => {
      navigation.navigate('HomeStack', {
        screen: 'Notifications',
        params: {
          notificationAction: '-touch-'.concat(getTimeInMillis().toString())
        }
      });
    }}
    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
  >
    <Icon name="bell" solid />
  </TouchableOpacity>
);

NotificationsTouch.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default NotificationsTouch;
