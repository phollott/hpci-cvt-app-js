import * as React from 'react';
import { View } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { t } from 'i18n-js';
import { colors } from '../constants';
import Icon from '../components/Icon';

const SettingsIcon = () => (
  <Icon name='cog' color={colors.grey} style={{ minWidth: 26 }} />
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
      <HorizontalLine />
      <DrawerItem
        label = { t('home.menu.privacyLabel') }
        icon = {GlobeIcon}
        onPress={() => {
          alert( t('home.introCard.title') );
          closeDrawer(props.navigation);
        }}
      />
      <DrawerItem
        label = { t('home.menu.aboutLabel') }
        icon = {AboutIcon}
        onPress={() => {
          alert( t('home.introCard.title') );
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

export default MenuDrawer;
