import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import ViewCardText from '../components/ViewCardText';

const TermsScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const termsViewKey = language.concat('TermsView');

  return (
    <View style={gStyle.container[theme]} key={termsViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.terms.card.title')}
          text={t('home.terms.card.instructionText')}
        />
        <View style={gStyle.spacer32} />
        <View style={{ width: '90%', justifyContent: 'center' }}>
          <Text>TODO</Text>
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

TermsScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

export default TermsScreen;
