import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-paper';
import { EventRegister } from 'react-native-event-listeners';
import { colors, gStyle } from '../constants';
import Icon from './Icon';
import { notifications as notificationsService } from '../services';
import { getTimeInMillis } from '../shared/date-fns';
import { isNil } from '../shared/util';

const NotificationsTouch = ({ navigation, route }) => {
  const [showNewBadge, setShowNewBadge] = useState(false);

  let listener;
  const addNotificationListener = () => {
    listener = EventRegister.addEventListener(
      'notificationEvent',
      (notification) => {
        setNewBadge(
          isNil(notification.viewed) && notification.isRemoved === false
        );
      }
    );
  };

  const setNewBadge = async (show = false) => {
    if (show) {
      setShowNewBadge(true);
    } else {
      const anyNotViewed = await notificationsService.isAnyNotificationNotViewed();
      setShowNewBadge(anyNotViewed);
    }
  };

  useEffect(() => {
    setNewBadge();

    addNotificationListener();

    // when component unmounts
    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []);

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel="notifications"
      accessibilityComponentType="button"
      accessibilityTraits="button"
      activeOpacity={gStyle.activeOpacity}
      onPress={() => {
        navigation.navigate('HomeStack', { screen: 'Home' });
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
      {showNewBadge && (
        <Badge
          size={10}
          style={[styles.notificationBadge, { backgroundColor: colors.green }]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationBadge: {
    position: 'absolute',
    top: 4,
    left: 28
  }
});

NotificationsTouch.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default NotificationsTouch;
