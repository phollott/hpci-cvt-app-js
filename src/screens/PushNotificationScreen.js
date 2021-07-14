import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import Alert from '../components/Alert';
import Touch from '../components/Touch';
import ViewCardText from '../components/ViewCardText';
import { notifications } from '../services';

// dev tool

// TODO: if using badges, will need to send empty message with badge count for ios...

const PushNotificationScreen = ({ navigation, route }) => {
  const theme = useTheme();

  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    notifications
      .retrieveExpoPushToken()
      .then((token) => setExpoPushToken(token));
  }, []);

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const pushNotificationViewKey = language.concat('PushNotificationView');

  const [messageText, setMessageText] = React.useState('');

  let covid19Products = [];
  covid19Products.push({ nid: 29, brandName: 'COVISHIELD', checked: false });
  covid19Products.push({ nid: 28, brandName: 'AstraZeneca', checked: false });
  covid19Products.push({ nid: 27, brandName: 'Janssen', checked: false });
  covid19Products.push({ nid: 16, brandName: 'Pfizer-BioNTech', checked: false });
  covid19Products.push({ nid: 15, brandName: 'Moderna', checked: false });
  covid19Products.push({ nid: 9, brandName: 'Veklury', checked: false });
  covid19Products.push({ nid: 8, brandName: 'Bamlanivimab', checked: false });

  const [products, setProducts] = React.useState(covid19Products);

  return (
    <View style={gStyle.container[theme]} key={pushNotificationViewKey}>
      <ScrollView contentContainerStyle={gStyle.contentContainer}>
        <ViewCardText
          title={t('home.pushNotification.card.title')}
          text={t('home.pushNotification.card.instructionText')}
        />
        <View style={gStyle.spacer16} />
        <View style={{ width: '90%', justifyContent: 'center' }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
            <View style={{ width: '100%' }}>
              <TextInput
                label="Message"
                value={messageText}
                onChangeText={(input) => setMessageText(input)}
              />
            </View>
            <View style={gStyle.spacer8} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {covid19Products.map((product, index) => (
                <View
                  key={product.brandName.concat('-view').concat(index)}
                  style={{ width: '50%' }}
                >
                  <Checkbox.Item
                    key={product.brandName.concat(index)}
                    label={product.brandName.toString()}
                    status={products[index].checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      covid19Products = [...products];
                      covid19Products[index].checked = !products[index].checked;
                      setProducts(covid19Products);
                    }}
                    style={{ marginVertical: 0 }}
                  />
                </View>
              ))}
            </View>
            <View style={gStyle.spacer8} />
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={async () => {
                  await sendPushNotification(messageText, products);
                }}
                text={t('home.pushNotification.button.sendTitle')}
                lIconName="share"
              />
            </View>
            <View style={gStyle.spacer8} />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Expo Push Token</Text>
            <View style={gStyle.spacer8} />
            <Text
              selectable
              style={(gStyle.text[theme], { fontSize: 14, fontWeight: 'bold' })}
            >
              {expoPushToken}
            </Text>
            <View style={gStyle.spacer16} />
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={() => {
                  const epntUrl = 'https:expo.io/notifications';
                  Linking.canOpenURL(epntUrl).then((supported) => {
                    if (supported) {
                      Linking.openURL(epntUrl);
                    }
                  });
                }}
                text={t('home.pushNotification.button.toolTitle')}
                lIconName="globe"
              />
            </View>
            <View style={gStyle.spacer16} />
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={() => {
                  const alertText = 'Example Data (JSON) [optional]:\n\n{"nid": 16}\nor\n{"nid": [15,16,9]}\n\n'.concat(
                    JSON.stringify(covid19Products, ['nid', 'brandName'])
                  );
                  Alert(alertText);
                }}
                text={t('tab.screen.productsLabel')}
                lIconName="info"
              />
            </View>
          </View>
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

// can use this function below, or
// Expo's Push Notification Tool-> https://expo.io/notifications  (data examples: {"nid": 16} or {"nid": [15,16,9]})
// TODO: replace with backend
async function sendPushNotification(messageText, products) {
  if (messageText.length === 0) {
    Alert('Please enter a message.');
    return;
  }
  notifications.retrieveExpoPushToken().then((expoPushToken) => {
    const nids = [];
    products.forEach((product) => {
      if (product.checked) {
        nids.push(product.nid);
      }
    });
    const message = {
      to: expoPushToken,
      sound: 'default',
      badge: 1,
      title: 'Health Canada • Santé Canada',
      body: messageText,
      data: { nid: nids }
    };
    notifications.sendExpoPushNotification(message);
  });
}

PushNotificationScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default PushNotificationScreen;
