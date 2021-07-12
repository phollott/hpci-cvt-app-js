import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, List, Divider } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';
import { lang } from '../constants/constants';
import Icon from '../components/Icon';
import ReadMoreText from '../components/ReadMoreText';
import ViewCardText from '../components/ViewCardText';
import {
  notifications as notificationsService,
  productsParser
} from '../services';

const NotificationsScreen = ({ navigation, route }) => {
  const theme = useTheme();

  // key: notificationsService.PERSIST_NOTIFICATION_KEY_PREFIX + notification.id
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationsService.retrieveNotifications().then((retrieved) => {
      setNotifications(retrieved.sort((a, b) => (a.date < b.date) ? 1 : -1));
    });
  }, []);

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  let notificationsViewKey = language.concat('NotificationsView');

  // concat notification action so screen rerenders when notification is added or removed
  if (typeof route.params !== "undefined" && typeof route.params.notificationAction !== "undefined") {
    notificationsViewKey = notificationsViewKey.concat(route.params.notificationAction);
  }

  function getFormattedDate(timeOfNotification) {
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
  }

  return (
    <View style={gStyle.container[theme]} key={notificationsViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.notifications.card.title')}
          text={t('home.notifications.card.instructionText')}
        />
        <View style={gStyle.spacer8} />
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          {notifications.map((notification) => (
            <View key={'view-'.concat(notification.id)}>
              <Divider />
              <List.Item
                key={notification.id}
                left={() => {
                  return (
                    <>
                      <Icon
                        reverse
                        name={
                          notification.data.nid &&
                          notification.data.nid.length > 0
                            ? 'shield-virus'
                            : 'envelope-open'
                        }
                        color={
                          notification.data.nid &&
                          notification.data.nid.length > 0
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
                onPress={() => {}}
                right={() => (
                  <Text
                    style={{
                      color: colors.grey,
                      fontSize: 12,
                      marginTop: 12,
                      marginRight: 14,
                      textAlign: 'right'
                    }}
                  >
                    {getFormattedDate(notification.date)}
                  </Text>
                )}
              />
              <Divider />
            </View>
          ))}
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBadge: {
    position: 'absolute',
    top: 2,
    left: 36
  }
});

NotificationsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default NotificationsScreen;
