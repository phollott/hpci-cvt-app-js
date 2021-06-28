import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import ViewButton from '../components/ViewButton';
import { colors, gStyle, images } from '../constants';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const homeViewKey = language.concat('HomeView');

  const titleLogo = 'canadianHealthProductsLogo';

  const futureEditionButtons = [
    t('home.infoCard.products.drugsTitle'),
    t('home.infoCard.products.naturalTitle'),
    t('home.infoCard.products.devicesTitle'),
    t('home.infoCard.products.veterinaryTitle')
  ];

  return (
    <View style={gStyle.container[theme]} key={homeViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <View style={{ width: '100%', justifyContent: 'center' }}>
          <Card style={{ borderRadius: 0, marginHorizontal: 0, marginTop: 0 }}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.darkColor,
                  fontWeight: 'bold',
                  fontSize: 20
                }}
              >
                {t('home.introCard.title')}
              </Text>
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
                  style={{ height: 90, width: 90, marginHorizontal: 16 }}
                  source={images[titleLogo]}
                />
                <Text
                  style={{
                    color: colors.darkColor,
                    fontSize: 16,
                    flex: 1,
                    flexWrap: 'wrap',
                    marginRight: 4
                  }}
                >
                  {t('home.introCard.meta')}
                </Text>
              </View>
            </Card.Content>
            <View style={gStyle.spacer16} />
            <Card.Content>
              <Text style={{ color: colors.darkColor }}>
                {t('home.introCard.text')}
              </Text>
            </Card.Content>
          </Card>
        </View>
        <View style={gStyle.spacer8} />
        <View style={{ width: '100%' }}>
          <Card style={{ borderRadius: 0, marginHorizontal: 0, marginTop: 0 }}>
            <Card.Content>
              <Text style={{ color: colors.darkColor, fontWeight: 'bold' }}>
                {t('home.infoCard.title')}
              </Text>
            </Card.Content>
            <View style={gStyle.spacer16} />
            <Card.Content>
              <Text style={{ color: colors.darkColor }}>
                {t('home.infoCard.currentText')}
              </Text>
              <View style={gStyle.spacer16} />
              <ViewButton
                text={t('home.infoCard.products.covidTitle')}
                onPress={() => {
                  navigation.navigate('ProductsStack', { screen: 'Products' });
                }}
                icon="checkbox-marked-circle-outline"
              />
              <View style={gStyle.spacer16} />
              <Text style={{ color: colors.darkColor }}>
                {t('home.infoCard.futureText')}
              </Text>
              <View style={gStyle.spacer16} />
              {futureEditionButtons.map((button, index) => (
                <View key={button.concat(index)}>
                  <ViewButton
                    text={button}
                    disabled
                    labelStyle={{ color: colors.grey, fontSize: 12 }}
                  />
                  <View style={gStyle.spacer8} />
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

HomeScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default HomeScreen;
