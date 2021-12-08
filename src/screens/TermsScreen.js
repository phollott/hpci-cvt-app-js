import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { List, Divider } from 'react-native-paper';
import HTML from 'react-native-render-html';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';
import ReadMoreText from '../components/ReadMoreText';
import ViewCardText from '../components/ViewCardText';

const TermsScreen = ({ navigation }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const termsViewKey = language.concat('TermsView');

  const [termsIntroText, setTermsIntroText] = useState('');
  const [termsSubsections, setTermsSubsections] = useState([]);

  const [privacyText, setPrivacyText] = useState('');

  const [contactInfoText, setContactInfoText] = useState('');

  useEffect(() => {
    setTermsIntroText(t('home.terms.tou.introTextHtml'));
    setTermsSubsections(getTermsSubsections());
    setPrivacyText(t('home.terms.pri.textHtml'));
    setContactInfoText(t('home.terms.con.textHtml'));
  }, []);

  const getTermsSubsections = () => {
    const subsections = [];
    for (let i = 1; i <= 13; i += 1) {
      if (t('home.terms.tou.subSection.'.concat(i).concat('.title')) !== '') {
        subsections.push({
          subTitle: t('home.terms.tou.subSection.'.concat(i).concat('.title')),
          subText: t('home.terms.tou.subSection.'.concat(i).concat('.text'))
        });
      }
    }
    return subsections;
  };

  return (
    <View style={gStyle.container[theme]} key={termsViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.terms.card.title')}
          text={t('home.terms.card.instructionText')}
        />
        <View style={gStyle.spacer16} />
        <View style={{ width: '100%', justifyContent: 'center' }}>
          <List.AccordionGroup>
            <List.Accordion
              id="tou"
              title={t('home.terms.accordion.tou')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue } }}
              left={() => {}}
            >
              <HTML
                source={{ html: termsIntroText }}
                containerStyle={{ marginHorizontal: 20 }}
              />
              {termsSubsections.map((subsection, index) => (
                <View
                  key={'view-'.concat(index)}
                  style={{ marginLeft: -60, marginRight: 20 }}
                >
                  <Divider />
                  <List.Item
                    key={'item-'.concat(index)}
                    title={<Text>{subsection.subTitle}</Text>}
                    titleStyle={{ fontWeight: 'bold', fontSize: 16 }}
                    titleNumberOfLines={2}
                    description={() => (
                      <>
                        <ReadMoreText
                          text={subsection.subText}
                          numberOfLines={5}
                        />
                      </>
                    )}
                    onPress={() => {}}
                    right={() => {}}
                  />
                </View>
              ))}
            </List.Accordion>
            <Divider />
            <List.Accordion
              id="pri"
              title={t('home.terms.accordion.pri')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue } }}
              left={() => {}}
            >
              <HTML
                source={{ html: privacyText }}
                containerStyle={{ marginHorizontal: 20 }}
              />
            </List.Accordion>
            <Divider />
            <List.Accordion
              id="con"
              title={t('home.terms.accordion.con')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue } }}
              left={() => {}}
            >
              <HTML
                source={{ html: contactInfoText }}
                containerStyle={{ marginHorizontal: 20 }}
              />
            </List.Accordion>
            <Divider />
          </List.AccordionGroup>
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
