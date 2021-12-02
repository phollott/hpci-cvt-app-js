import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import ViewCardText from '../components/ViewCardText';
import ViewSwitch from '../components/ViewSwitch';

const NotificationsSettingsScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const notificationsSettingsViewKey = language.concat(
    'NotificationsSettingsView'
  );

  const [isNotificationsSwitchOn, setIsNotificationsSwitchOn] = React.useState(
    false
  );

  const [isNewProductsSwitchOn, setIsNewProductsSwitchOn] = React.useState(
    false
  );

  const [
    isBookmarkedProductsSwitchOn,
    setIsBookmarkedProductsSwitchOn
  ] = React.useState(false);

  const onToggleNotificationsSwitch = () => {
    const switchWasOn = isNotificationsSwitchOn;
    setIsNotificationsSwitchOn(!isNotificationsSwitchOn);
    if (switchWasOn) {
      setIsNewProductsSwitchOn(false);
      setIsBookmarkedProductsSwitchOn(false);
    }
  };

  const onToggleNewProductsSwitch = () => {
    setIsNewProductsSwitchOn(!isNewProductsSwitchOn);
  };

  const onToggleBookmarkedProductsSwitch = () => {
    setIsBookmarkedProductsSwitchOn(!isBookmarkedProductsSwitchOn);
  };

  return (
    <View style={gStyle.container[theme]} key={notificationsSettingsViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.settings.notifications.title')}
          text={t('home.settings.notifications.instructionText')}
        />
        <View style={gStyle.spacer32} />
        <ViewSwitch
          text={t('home.settings.notifications.switch.notificationsLabel')}
          value={isNotificationsSwitchOn}
          onValueChange={onToggleNotificationsSwitch}
        />
        <View style={gStyle.spacer48} />
        {isNotificationsSwitchOn && (
          <>
            <ViewSwitch
              text={t('home.settings.notifications.switch.newProductsLabel')}
              value={isNewProductsSwitchOn}
              onValueChange={onToggleNewProductsSwitch}
            />
            <View style={{ width: '90%', textAlign: 'left' }}>
              <Text style={{ width: '80%' }}>
                {t('home.settings.notifications.switch.newProductsText')}
              </Text>
            </View>
            <View style={gStyle.spacer32} />
            <ViewSwitch
              text={t(
                'home.settings.notifications.switch.bookmarkedProductsLabel'
              )}
              value={isBookmarkedProductsSwitchOn}
              onValueChange={onToggleBookmarkedProductsSwitch}
            />
            <View style={{ width: '90%', textAlign: 'left' }}>
              <Text style={{ width: '80%' }}>
                {t('home.settings.notifications.switch.bookmarkedProductsText')}
              </Text>
            </View>
          </>
        )}
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

NotificationsSettingsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default NotificationsSettingsScreen;
