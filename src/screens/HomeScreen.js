import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ScrollView,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { colors, func, gStyle, images } from '../constants';
import {
  lang,
  covidVaccinePortal,
  portailVaccinCovid
} from '../constants/constants';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const isOnline = useSelector((state) => state.settings.isOnline);
  const homeViewKey = language.concat('HomeView');

  const titleLogo = 'canadianHealthProductsLogo';

  const linkingPortal = () => {
    if (isOnline) {
      func.openURL(
        language === lang.french ? portailVaccinCovid : covidVaccinePortal
      );
    }
    return false;
  };

  const fillSpace = () => {
    // header/footer: 128, card: 316, offset: 24
    const height = useWindowDimensions().height - 128 - 316 + 24;
    return height > 0 ? height : 24;
  };

  return (
    <View style={gStyle.container[theme]} key={homeViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <View style={{ width: '100%', justifyContent: 'center' }}>
          <Card style={{ borderRadius: 0, marginHorizontal: 0, marginTop: 0 }}>
            <Card.Content style={{ alignItems: 'center' }}>
              <View style={{ width: '100%' }}>
                {isOnline && (
                  <Text
                    onPress={() => {
                      linkingPortal();
                    }}
                    style={{
                      color: colors.darkColor,
                      textAlign: 'right',
                      marginTop: -10,
                      textDecorationLine: 'underline'
                    }}
                  >
                    {t('home.introCard.link')}
                  </Text>
                )}
                {!isOnline && <View style={gStyle.spacer8} />}
                <View style={gStyle.spacer32} />
                <Text
                  style={{
                    color: colors.darkColor,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 20
                  }}
                >
                  {t('home.introCard.title')}
                </Text>
              </View>
            </Card.Content>
            <View style={gStyle.spacer16} />
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  style={{ height: 150, width: 150, marginHorizontal: 16 }}
                  source={images[titleLogo]}
                />
              </View>
            </Card.Content>
            <View style={gStyle.spacer32} />
            <Card.Content>
              <Text
                style={{
                  color: colors.darkColor,
                  textAlign: 'center'
                }}
              >
                {t('home.introCard.text')}
              </Text>
            </Card.Content>
            <View style={{ height: fillSpace(), width: '100%' }} />
          </Card>
        </View>
        <View style={gStyle.spacer8} />
      </ScrollView>
    </View>
  );
};

HomeScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default HomeScreen;
