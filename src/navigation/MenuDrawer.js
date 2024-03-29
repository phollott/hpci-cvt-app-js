import * as React from 'react';
import { View } from 'react-native';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { PNS_ENV } from 'react-native-dotenv';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { t } from 'i18n-js';
import { colors } from '../constants';
import Icon from '../components/Icon';
import RemoveData from '../components/RemoveData';

const SettingsIcon = () => (
  <Icon name="cog" color={colors.grey} containerStyle={{ minWidth: 26 }} />
);

const TermsIcon = () => (
  <Icon
    name="shield-check"
    type="material-community"
    color={colors.grey}
    containerStyle={{ minWidth: 26 }}
  />
);

const BellIcon = () => (
  <Icon
    name="bell"
    solid
    color={colors.grey}
    containerStyle={{ minWidth: 26 }}
  />
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
    <SafeAreaProvider>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label={t('home.menu.aboutLabel')}
          icon={AboutIcon}
          onPress={() => {
            navigation.navigate('About');
          }}
        />
        <DrawerItem
          label={t('home.menu.termsLabel')}
          icon={TermsIcon}
          onPress={() => {
            navigation.navigate('Terms');
          }}
        />
        <DrawerItem
          label={t('home.menu.whatsNewLabel')}
          icon={BellIcon}
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
        <DrawerItem
          label={t('home.menu.notificationsLabel')}
          labelStyle={{
            paddingLeft: 72
          }}
          onPress={() => {
            navigation.navigate('NotificationsSettings');
          }}
        />
        {PNS_ENV.toLowerCase().includes('dev') && <HorizontalLine />}
        {PNS_ENV.toLowerCase().includes('dev') && <DrawerItem label={t('home.menu.toolsLabel')} icon={ToolIcon} onPress={() => {}} />}
        {PNS_ENV.toLowerCase().includes('dev') && <DrawerItem label={t('home.menu.sendNotificationLabel')} labelStyle={{ paddingLeft: 72 }} onPress={() => { navigation.navigate('PushNotification'); }} />}
        {PNS_ENV.toLowerCase().includes('dev') && <DrawerItem label={t('home.menu.removeLabel')} labelStyle={{ paddingLeft: 72 }} onPress={() => { RemoveData(props); closeDrawer(navigation); }} />}
        {1 === 0 && <HorizontalLine />}
        {1 === 0 && <DrawerItemList {...props} />}
      </DrawerContentScrollView>
    </SafeAreaProvider>
  );
};

const closeDrawer = (navigation) => {
  navigation.dispatch(DrawerActions.closeDrawer());
};

export default MenuDrawer;
