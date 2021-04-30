import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';
import Icon from '../components/Icon';

// menu drawer (items)
import MenuDrawer from './MenuDrawer';

// screens
import HomeScreen from '../screens/HomeScreen';

const CloseIcon = () => (
  <Icon name='times' color={colors.grey} style={{ minWidth: 26 }} />
);

const Drawer = createDrawerNavigator();

// only Home is active and is the only screen for the drawer navigator; drawer item screens are on HomeStack
const HomeNavigator = () => {
  return (
    <Drawer.Navigator 
      drawerContent = { props => <MenuDrawer {...props} /> }
      drawerPosition = 'right'
      drawerStyle = {{
        backgroundColor: colors.white,
        width: 300,
      }}
      drawerContentOptions = {{
        activeBackgroundColor: colors.white,
        activeTintColor: gStyle.tintColor.inactive.light
      }}
    >
      <Drawer.Screen 
        name = "Home" 
        component = {HomeScreen}
        options = {{
          title: t('home.menu.closeLabel'),
          drawerIcon: CloseIcon
        }}
      />
    </Drawer.Navigator>
  );
}

export default HomeNavigator;