import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Badge, List, Divider } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';
import { lang } from '../constants/constants';
import Icon from '../components/Icon';
import ReadMoreText from '../components/ReadMoreText';
import Touch from '../components/Touch';
import ViewCardText from '../components/ViewCardText';
import {
  notifications as notificationsService,
  productsParser
} from '../services';

const NotificationsScreen = ({ navigation, route }) => {
  const theme = useTheme();

  const [notifications, setNotifications] = useState([]);

  const dateComparator = (a, b) => {
    return a.date < b.date ? 1 : -1;
  };

  const retrieveNotifications = () => {
    notificationsService.retrieveNotifications().then((retrieved) => {
      setNotifications(retrieved.sort(dateComparator));
    });
  };

  let listener;
  const addNotificationEventListener = () => {
    listener = EventRegister.addEventListener(
      'notificationEvent',
      (notification) => {
        // update notifications state
        setNotifications((prevState) => {
          const currState = prevState.filter((value) => {
            return value.id !== notification.id;
          });
          if (!notification.isRemoved) {
            currState.push(notification);
          }
          currState.sort(dateComparator);
          return currState;
        });
      }
    );
  };

  useEffect(() => {
    retrieveNotifications();

    addNotificationEventListener();

    // when component unmounts
    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []);

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  let notificationsViewKey = language.concat('NotificationsView');

  // concat notification action so screen rerenders, e.g. when NotificationsTouch is pressed
  if (
    typeof route.params !== 'undefined' &&
    typeof route.params.notificationAction !== 'undefined'
  ) {
    notificationsViewKey = notificationsViewKey.concat(
      route.params.notificationAction
    );
  }

  const isOnline = useSelector((state) => state.settings.isOnline);

  const getFormattedDate = (timeOfNotification) => {
    let formattedDate = productsParser.getFormattedDateFromHtml(
      '<time datetime="'
        .concat(
          new Date(
            timeOfNotification.toString().indexOf('.') > -1
              ? Math.round(timeOfNotification * 1000)
              : timeOfNotification
          ).toString()
        )
        .concat('">'),
      language
    );
    formattedDate = formattedDate.substring(
      0,
      formattedDate.lastIndexOf(language === lang.english ? ',' : ' ')
    );
    if (formattedDate.length > 7) {
      formattedDate = formattedDate.replace(' ', '\n');
    }
    return formattedDate;
  };

  const deleteNotification = (notification) => {
    const { id } = notification;
    notificationsService.deleteNotification(notification).then(() => {
      // update notifications state
      setNotifications((prevState) => {
        const newState = prevState.filter((value) => {
          return value.id !== id;
        });
        return newState;
      });
    });
  };

  const handleNotificationOnPress = (notification) => {
    const { id, isRead } = notification;
    if (!isRead && !notificationsService.isProductSpecific(notification)) {
      notificationsService
        .updateNotificationIsRead(notification, true)
        .then((updated) => {
          // update notifications state
          setNotifications((prevState) => {
            const currState = prevState.filter((value) => {
              return value.id !== id;
            });
            currState.push(updated);
            currState.sort(dateComparator);
            return currState;
          });
        });
    }
    if (notificationsService.isProductSpecific(notification)) {
      if (isOnline) {
        navigation.navigate('ProductsStack', { screen: 'Products' });
      } else {
        navigation.navigate('BookmarksStack', { screen: 'Bookmarks' });
      }
    }
  };

  const renderRightActions = (notification) => (
    <Touch
      style={styles.rightOpenContainer}
      textStyle={styles.rightRemoveItem}
      text={t('common.button.remove')}
      onPress={() => {
        deleteNotification(notification);
      }}
    />
  );

  const swipeFromRightOpen = () => {
    // console.log('Swipe from right');
  };

  return (
    <View style={gStyle.container[theme]} key={notificationsViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.notifications.card.title')}
          text={t('home.notifications.card.instructionText')}
        />
        <View style={gStyle.spacer8} />
        {notifications.length > 0 && (
          <View style={styles.listItemsContainer}>
            {notifications.map((notification) => (
              <View key={'view-'.concat(notification.id)}>
                <Divider />
                <Swipeable
                  renderRightActions={() => renderRightActions(notification)}
                  onSwipeableRightOpen={swipeFromRightOpen}
                >
                  <List.Item
                    key={notification.id}
                    left={() => {
                      return (
                        <>
                          <Icon
                            reverse
                            name={
                              notificationsService.isProductSpecific(
                                notification
                              )
                                ? 'shield-virus'
                                : 'envelope-open'
                            }
                            color={
                              notificationsService.isProductSpecific(
                                notification
                              )
                                ? colors.darkColor
                                : colors.darkColor
                            }
                          />
                          {!notification.isRead && (
                            <Badge
                              size={14}
                              style={[
                                styles.notificationBadge,
                                { backgroundColor: colors.green }
                              ]}
                            />
                          )}
                        </>
                      );
                    }}
                    title={<Text>{notification.title.trim()}</Text>}
                    titleStyle={{ fontWeight: 'bold' }}
                    titleNumberOfLines={2}
                    description={() => (
                      <ReadMoreText
                        text={notification.body.trim()}
                        numberOfLines={2}
                      />
                    )}
                    onPress={() => {
                      handleNotificationOnPress(notification);
                    }}
                    right={() => (
                      <Text style={styles.rightListItemText}>
                        {getFormattedDate(notification.date)}
                      </Text>
                    )}
                  />
                </Swipeable>
                <Divider />
              </View>
            ))}
          </View>
        )}
        {notifications.length === 0 && (
          <ViewCardText text={t('home.notifications.emptyText')} />
        )}
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemsContainer: {
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center'
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    left: 36
  },
  rightListItemText: {
    color: colors.grey,
    fontSize: 12,
    marginTop: 12,
    marginRight: 14,
    textAlign: 'right'
  },
  rightOpenContainer: {
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 20
  },
  rightRemoveItem: {
    color: colors.white,
    paddingHorizontal: 40,
    paddingVertical: 20
  }
});

NotificationsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default NotificationsScreen;
