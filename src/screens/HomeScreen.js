import * as React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, View } from 'react-native';
import { Button, Card, ThemeProvider } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import {t} from 'i18n-js';
import { gStyle, images } from '../constants';
import Icon from '../components/Icon';

//const HomeScreen = ({ navigation, screenProps }) => {
const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector(state => state.settings.language);
  const homeViewKey = language + "HomeView";

  const titleLogo = 'covidAlertLogo';

// [pmh] this method of uapplying dark mode should work with RNE, but is untested

  return (
    <ThemeProvider theme={ gStyle.mytheme } useDark={ colorScheme === 'dark' }>

      <View style={gStyle.container[theme]} key={homeViewKey}>
        <ScrollView contentContainerStyle={gStyle.contentContainer}>
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Card>
              <Card.Title style={gStyle.text[theme], {fontSize: 18}}>{ t('home.introCard.title') }</Card.Title>
              <View style={{ flex: 1 }}>
                <Image
                  style={{ alignSelf: 'center', height: 120, width: 120 }}
                  source={images[titleLogo]}
                />
                <View style={gStyle.spacer16} />
              </View>
              <Text style={gStyle.text[theme], {fontSize: 16}}>{ t('home.introCard.text') }</Text>
            </Card>
          </View>
          <View style={gStyle.spacer32} />
          <Button
            onPress={() => {
              navigation.navigate('ProductsStack', {screen: 'Products'});
            }}
            icon={
              <Icon name='shield-virus' size={40} style={{paddingRight: 8}} />
            }
            title={ t('home.button.products.title') }
            containerStyle={ gStyle.container.light }
            titleStyle={{ color: "black" }}
            raised={true}
            type="outline"
          />
          <View style={gStyle.spacer32} />
        </ScrollView>
      </View>
      
    </ThemeProvider>
  );
};

HomeScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired //,
  //screenProps: PropTypes.object.isRequired
};

export default HomeScreen;
