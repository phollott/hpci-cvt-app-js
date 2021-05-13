import * as React from 'react';
import { Alert as Confirm, View } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { t } from 'i18n-js';
import { colors } from '../constants';
import Icon from '../components/Icon';
import Alert from '../components/Alert';
import { storage } from '../services';

const SettingsIcon = () => (
  <Icon name='cog' color={colors.grey} style={{ minWidth: 26 }} />
);

const RemoveIcon = () => (
  <Icon name='eraser' color={colors.grey} style={{ minWidth: 26 }} />
);

const GlobeIcon = () => (
  <Icon name='globe' color={colors.grey} style={{ minWidth: 26 }} />
);

const AboutIcon = () => (
  <Icon name='info' color={colors.grey} style={{ minWidth: 26 }} />
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
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label = { t('home.menu.settingsLabel') }
        icon = {SettingsIcon}
        onPress={() => {}}
      />
      <DrawerItem
        label = { t('home.menu.languageLabel') }
        labelStyle =  {{
          paddingLeft: 72
        }}
        onPress={() => {
          props.navigation.navigate('Language');
          closeDrawer(props.navigation);
        }}
      />
      <DrawerItem
        label = { t('home.menu.removeLabel') }
        icon = {RemoveIcon}
        onPress={() => {
          showRemoveAlert(props);
        }}
      />
      <HorizontalLine />
      <DrawerItem
        label = { t('home.menu.privacyLabel') }
        icon = {GlobeIcon}
        onPress={() => {
          Alert( t('home.introCard.title') );
          closeDrawer(props.navigation);
        }}
      />
      <DrawerItem
        label = { t('home.menu.aboutLabel') }
        icon = {AboutIcon}
        onPress={() => {
          Alert( t('home.introCard.title') );
          closeDrawer(props.navigation);
        }}
      />
      <DrawerItemList
        {...props} 
      />
    </DrawerContentScrollView>
  );
}

const closeDrawer = (navigation) => {
  navigation.dispatch(DrawerActions.closeDrawer());
}

// [mrj] TODO: ****remove this 'feature' at some point.
const showRemoveAlert = (props) => {
  try {
    Confirm.alert(
      t('home.menu.removeAlert.title'),
      t('home.menu.removeAlert.text'),
      [
        { text: t('common.alert.button.cancel'), onPress: () => {}, style: "cancel" },
        { text: t('common.alert.button.ok'), 
          onPress: async () => {
            // clear settings, bookmarks
            await storage.deleteAll();
            closeDrawer(props.navigation);
            // [mrj] hack: navigation is used to ensure the bookmarks screen is re-rendered after bookmarks are cleared
            props.navigation.navigate('BookmarksStack', {screen: 'Bookmarks', params: { bookmarkAction: '-clear'}});
            props.navigation.navigate('HomeStack', {screen: 'Home'});
          }
        }
      ]
    );
  } catch (error) {
    console.log('Unable to clear storage. ', error);
  }
}

export default MenuDrawer;
