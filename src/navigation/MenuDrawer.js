import * as React from 'react';
import { View } from 'react-native';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { t } from 'i18n-js';
import { colors } from '../constants';
import Icon from '../components/Icon';
import Alert from '../components/Alert';
import RemoveData from '../components/RemoveData';

const NotificationsIcon = () => (
  <Icon name="bell" solid color={colors.grey} containerStyle={{ minWidth: 26 }} />
);

const SettingsIcon = () => (
  <Icon name="cog" color={colors.grey} containerStyle={{ minWidth: 26 }} />
);

const GlobeIcon = () => (
  <Icon name="globe" color={colors.grey} containerStyle={{ minWidth: 26 }} />
);

const AboutIcon = () => (
  <Icon name="info" color={colors.grey} containerStyle={{ minWidth: 26 }} />
);

const ToolIcon = () => (
  <Icon name="tools" color={colors.grey} containerStyle={{ minWidth: 26 }} />
);

const HorizontalLine = () => (
  <View
    style={{
      borderBottomColor: colors.grey,
      borderBottomWidth: 1,
      margin: 20
    }}
  />
);

const MenuDrawer = (props) => {
  const { navigation } = props;

  useFocusEffect(
    React.useCallback(() => {
      // drawer is focused
      return () => {
        // drawer is unfocused
        closeDrawer(navigation);
      };
    }, [])
  );

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={t('home.menu.notificationsLabel')}
        icon={NotificationsIcon}
        onPress={() => {
          navigation.navigate('Notifications');
        }}
      />
      <DrawerItem
        label={t('home.menu.settingsLabel')}
        icon={SettingsIcon}
        onPress={() => {}}
      />
      <DrawerItem
        label={t('home.menu.languageLabel')}
        labelStyle={{
          paddingLeft: 72
        }}
        onPress={() => {
          navigation.navigate('Language');
        }}
      />
      <HorizontalLine />
      <DrawerItem
        label={t('home.menu.toolsLabel')}
        icon={ToolIcon}
        onPress={() => {}}
      />
      <DrawerItem
        label={t('home.menu.sendNotificationLabel')}
        labelStyle={{
          paddingLeft: 72
        }}
        onPress={() => {
          navigation.navigate('PushNotification');
        }}
      />
      <DrawerItem
        label={t('home.menu.removeLabel')}
        labelStyle={{
          paddingLeft: 72
        }}
        onPress={() => {
          RemoveData(props);
          closeDrawer(navigation);
        }}
      />
      <HorizontalLine />
      <DrawerItem
        label={t('home.menu.privacyLabel')}
        icon={GlobeIcon}
        onPress={() => {
          Alert(t('home.introCard.title'));
          closeDrawer(navigation);
        }}
      />
      <DrawerItem
        label={t('home.menu.aboutLabel')}
        icon={AboutIcon}
        onPress={() => {
          Alert(t('home.introCard.title'));
          closeDrawer(navigation);
        }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const closeDrawer = (navigation) => {
  navigation.dispatch(DrawerActions.closeDrawer());
};

export default MenuDrawer;
