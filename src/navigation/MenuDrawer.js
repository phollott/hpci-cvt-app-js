import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerActions } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';

// SettingsIcon
const SettingsIcon = ({ focused }) => (
  <Icon
    name='cog'
    type='font-awesome-5'
    size={20}
    color={
      focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
    }
    style={{ minWidth: 26 }}
  />
);

// GlobeIcon
const GlobeIcon = ({ focused }) => (
  <Icon
    name='globe'
    type='font-awesome-5'
    size={20}
    color={
      focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
    }
    style={{ minWidth: 26 }}
  />
);

// AboutIcon
const AboutIcon = ({ focused }) => (
  <Icon
    name='info'
    type='font-awesome-5'
    size={20}
    color={
      focused ? gStyle.tintColor.active.light : gStyle.tintColor.inactive.light
    }
    style={{ minWidth: 26 }}
  />
);

const HorizontalLine = () => (
  <View
    style={{
      borderBottomColor: colors.grey,
      borderBottomWidth: 1,
      marginHorizontal: 20,
      marginVertical: 20
    }}
  />
);

const MenuDrawer = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList
        {...props} 
      />
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
    </DrawerContentScrollView>
  );
}

const closeDrawer = (navigation) => {
  navigation.dispatch(DrawerActions.closeDrawer());
}

export default MenuDrawer;
