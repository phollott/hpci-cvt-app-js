import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { isNil } from '../shared/util';

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
  const addNotificationListener = () => {
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

    addNotificationListener();

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
    let formattedDate = productsParser.getFormattedDate(
      new Date(
        timeOfNotification.toString().indexOf('.') > -1
          ? Math.round(timeOfNotification * 1000)
          : timeOfNotification
      ),
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
    const { viewed } = notification;
    if (isNil(viewed)) {
      notificationsService.setViewed(notification);
    }
    const externalLink = notificationsService.getExternalLink(notification);
    if (isOnline && externalLink !== '') {
      // console.log('external link (show in browser): ' + externalLink);
      Linking.canOpenURL(externalLink).then((supported) => {
        if (supported) {
          Linking.openURL(externalLink);
        }
      });
    } else if (notificationsService.isProductSpecific(notification)) {
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
                          {isNil(notification.viewed) && (
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
                    right={() => {
                      return (
                        <View style={styles.rightListItem}>
                          {notificationsService.getExternalLink(
                            notification
                          ) !== '' && (
                            <Icon
                              name="open-in-new"
                              type="material-community"
                              color={colors.darkColor}
                              containerStyle={{ marginBottom: 4 }}
                            />
                          )}
                          <Text style={styles.rightListItemText}>
                            {getFormattedDate(notification.date)}
                          </Text>
                        </View>
                      );
                    }}
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
  rightListItem: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 12,
    marginRight: 14,
    marginBottom: 12
  },
  rightListItemText: {
    color: colors.grey,
    fontSize: 12,
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
