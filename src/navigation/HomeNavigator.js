import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { t } from 'i18n-js';
import { colors } from '../constants';
import Icon from '../components/Icon';

// menu drawer (items)
import MenuDrawer from './MenuDrawer';

// screens
import HomeScreen from '../screens/HomeScreen';

const CloseIcon = () => (
  <Icon name="times" color={colors.grey} containerStyle={{ minWidth: 26 }} />
);

const Drawer = createDrawerNavigator();

// only Home is active and is the only screen for the drawer navigator; drawer item screens are on HomeStack
const HomeNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MenuDrawer {...props} />}
      drawerPosition="left"
      drawerStyle={{
        backgroundColor: colors.lightGrey,
        width: 300
      }}
      drawerContentOptions={{
        activeBackgroundColor: colors.lightGrey,
        activeTintColor: colors.grey
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('home.menu.closeLabel'),
          drawerIcon: CloseIcon
        }}
      />
    </Drawer.Navigator>
  );
};

export default HomeNavigator;
