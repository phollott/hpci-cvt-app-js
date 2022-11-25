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
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { colors, func, gStyle, images } from '../constants';
import {
  lang,
  covidVaccinePortal,
  portailVaccinCovid
} from '../constants/constants';
import Icon from '../components/Icon';

export const homeScrollViewRef = React.createRef();

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
    // header/footer: 128, card: 316, offset/default
    const height = useWindowDimensions().height - 128 - 316 + 32;
    return height > 0 ? height : 32;
  };

  useFocusEffect(
    React.useCallback(() => {
      // screen is focused
      homeScrollViewRef.current?.scrollTo({ y: 0, animated: false });
      return () => {
        // screen is unfocused
      };
    }, [])
  );

  return (
    <View style={gStyle.container[theme]} key={homeViewKey}>
      <ScrollView
        contentContainerStyle={gStyle.contentContainer}
        ref={homeScrollViewRef}
      >
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
                      marginRight: -2,
                      textDecorationLine: 'underline'
                    }}
                  >
                    {t('home.introCard.link')}
                    <Icon
                      name="open-in-new"
                      type="material-community"
                      color={colors.darkColor}
                      containerStyle={{
                        paddingLeft: 6,
                        paddingTop: 6
                      }}
                    />
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
                  textAlign: 'center',
                  fontSize: 16
                }}
              >
                {t('home.introCard.text')}
              </Text>
              <Text
                style={{
                  color: colors.darkColor,
                  fontSize: 12,
                  marginTop: 8,
                  textAlign: 'center'
                }}
              >
                v0.0.46
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
