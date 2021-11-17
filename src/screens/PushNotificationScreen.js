/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { sendPushNotification } from '../api/pushNotificationService';
import { gStyle } from '../constants';
import Alert from '../components/Alert';
import Touch from '../components/Touch';
import ViewCardText from '../components/ViewCardText';
import { addProduct } from '../redux/actions/productActions';
import { addBookmark } from '../redux/actions/bookmarkActions';
import { selectBookmarkIDs } from '../redux/selectors/bookmarkSelector';
import { notifications, productsParser } from '../services';
import {
  getDate,
  getTimeInMillis,
  getDateWithTimezoneOffset
} from '../shared/date-fns';

// dev tool

const PushNotificationScreen = ({ navigation, route }) => {
  const theme = useTheme();

  // use hook to get language and set as key so react creates a new component instance when language gets changed
  const language = useSelector((state) => state.settings.language);
  const pushNotificationViewKey = language.concat('PushNotificationView');

  // use hook to get bookmark nids so device and preferences can be dispatched to PNS (dev setup)
  const bookmarks = useSelector((state) => {
    return selectBookmarkIDs(state);
  });

  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    notifications.retrieveExpoPushToken().then((token) => {
      setExpoPushToken(token);
      notifications.dispatchPreferences(language, bookmarks);
    });
  }, []);

  const [titleTextEn, setTitleTextEn] = React.useState('Health Canada');
  const [messageTextEn, setMessageTextEn] = React.useState('');

  const [titleTextFr, setTitleTextFr] = React.useState('Santé Canada');
  const [messageTextFr, setMessageTextFr] = React.useState('');

  let covid19Products = [];
  covid19Products.push({ nid: '29', brandName: 'COVISHIELD', checked: false });
  covid19Products.push({ nid: '28', brandName: 'Vaxzevria', checked: false });
  covid19Products.push({ nid: '27', brandName: 'Janssen', checked: false });
  covid19Products.push({ nid: '16', brandName: 'Comirnaty', checked: false });
  covid19Products.push({ nid: '15', brandName: 'SPIKEVAX', checked: false });
  covid19Products.push({ nid: '9', brandName: 'Veklury', checked: false });
  covid19Products.push({ nid: '8', brandName: 'Bamlanivimab', checked: false });
  covid19Products.push({ nid: '36', brandName: 'Sotrovimab', checked: false });
  covid19Products.push({ nid: '34', brandName: 'Casirivimab / imdevimab', checked: false });

  const [products, setProducts] = React.useState(covid19Products);

  const [addTestResourceChecked, setAddTestResourceChecked] = React.useState(false);

  const [linkText, setLinkText] = React.useState('');

  // prep test resource for all products and set to local state
  const formatMonth = () => {
    return ''.concat(1 + getDate().getMonth());
  };
  const formatDate = () => {
    return ''.concat(getDate().getDate());
  };
  const formatCurrentDate = () => {
    return getDateWithTimezoneOffset(
      ''
        .concat(getDate().getFullYear())
        .concat('-')
        .concat(formatMonth().length === 2 ? formatMonth() : '0'.concat(formatMonth()))
        .concat('-')
        .concat(formatDate().length === 2 ? formatDate() : '0'.concat(formatDate()))
    );
  };
  const bookmarksInStore = useSelector((state) => state.bookmarks);
  const productsInStore = useSelector((state) => {
    return state.products.filter((product) => {
      return productsParser.isAuthorizedProduct(product);
    });
  });
  const [testProducts, setTestProducts] = useState({});
  useEffect(() => {
    const productsWithTestProducts = [];
    productsInStore.forEach((product) => {
      //console.log(product.nid);
      const testProduct = { ...product };
      const resourcesWithTestResource = [];
      let newTestResource = {};
      product.resources.forEach((resource) => {
        // consummer rds for Va,Sp,Cov,J,Com,B,Ve,So,CI: 77,56,92,106,29,19,8
        if (['77', '56', '92', '106', '29', '19', '8', '145', '134'].includes(resource.id)) {
          newTestResource = { ...resource };
          newTestResource = JSON.parse(JSON.stringify(newTestResource));
          newTestResource.id = resource.id.concat('000');
          newTestResource.resource_link.text = 'Regulatory Decision Summary - test';
          switch (resource.id) {
            case '77': // Vaxzevria:
              newTestResource.date = resource.date.replace('2021-02-26', formatCurrentDate());
              break;
            case '56': // SPIKEVAX:
              newTestResource.date = resource.date.replace('2020-12-23', formatCurrentDate());
              break;
            case '92': // COVISHIELD:
              newTestResource.date = resource.date.replace('2021-02-26', formatCurrentDate());
              break;
            case '106': // Janssen:
              newTestResource.date = resource.date.replace('2021-03-12', formatCurrentDate());
              break;
            case '29': // Comirnaty:
              newTestResource.date = resource.date.replace('2020-12-09', formatCurrentDate());
              break;
            case '19': // Bamlanivimab:
              newTestResource.date = resource.date.replace('2020-10-12', formatCurrentDate());
              break;
            case '8': // Veklury:
              newTestResource.date = resource.date.replace('2020-07-27', formatCurrentDate());
              break;
            case '145': // Sotrovimab:
              newTestResource.date = resource.date.replace('2021-07-30', formatCurrentDate());
              break;
            case '134': // Casirivimab / imdevimab:
              newTestResource.date = resource.date.replace('2021-06-09', formatCurrentDate());
              break;
            default:
              break;
          }
          resourcesWithTestResource.push(resource);
          resourcesWithTestResource.push(newTestResource);
        } else {
          resourcesWithTestResource.push(resource);
        }
      });
      testProduct.resources = [...resourcesWithTestResource];
      productsWithTestProducts.push(testProduct);
    });
    setTestProducts(productsWithTestProducts);
  }, []);
  const dispatch = useDispatch();
  const replaceProductWithTestProduct = (enfrTestProduct) =>
    dispatch(addProduct(enfrTestProduct));
  const replaceBookmarkWithTestProduct = (enfrTestProduct) =>
    dispatch(addBookmark(enfrTestProduct));
  const navStacks = () => {
    // [mrj] hack: navigation is used to ensure screens are re-rendered after dispatch (and before pn)
    navigation.navigate('ProductsStack', {
      screen: 'Products',
      params: {
        productAction: '-pntest-'.concat(getTimeInMillis().toString())
      }
    });
    navigation.navigate('BookmarksStack', {
      screen: 'Bookmarks',
      params: {
        bookmarkAction: '-pntest-'.concat(getTimeInMillis().toString())
      }
    });
    navigation.navigate('HomeStack', {
      screen: 'PushNavigation'
    });
  };

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
                label="Title - English"
                value={titleTextEn}
                onChangeText={(input) => setTitleTextEn(input)}
              />
            </View>
            <View style={{ width: '100%' }}>
              <TextInput
                label="Message - English"
                value={messageTextEn}
                onChangeText={(input) => setMessageTextEn(input)}
              />
            </View>
            <View style={gStyle.spacer8} />
            <View style={{ width: '100%' }}>
              <TextInput
                label="Titre - Français"
                value={titleTextFr}
                onChangeText={(input) => setTitleTextFr(input)}
              />
            </View>
            <View style={{ width: '100%' }}>
              <TextInput
                label="Message - Français"
                value={messageTextFr}
                onChangeText={(input) => setMessageTextFr(input)}
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
            {1 === 0 && (
              <View>
                <Checkbox.Item
                  label={'Add test resource'}
                  status={addTestResourceChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setAddTestResourceChecked(!addTestResourceChecked);
                  }}
                  style={{ marginVertical: 0 }}
                />
              </View>
            )}
            <View style={gStyle.spacer8} />
            <View style={{ width: '100%' }}>
              <TextInput
                label={t('home.pushNotification.linkLabel')}
                value={linkText}
                onChangeText={(input) => setLinkText(input)}
              />
            </View>
            <View style={gStyle.spacer16} />
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={async () => {
                  if (
                    messageTextEn.length === 0 &&
                    messageTextFr.length === 0
                  ) {
                    Alert('Please enter a message.');
                    return;
                  }
                  if (
                    (messageTextEn.length > 0 && titleTextEn.length === 0) ||
                    (messageTextFr.length > 0 && titleTextFr.length === 0)
                  ) {
                    Alert('Please enter a title.');
                    return;
                  }
                  if (
                    linkText.length > 0 &&
                    !(
                      linkText.toLowerCase().startsWith('https://') ||
                      linkText.toLowerCase().startsWith('http://')
                    )
                  ) {
                    Alert('Please enter a valid external link.');
                    return;
                  }
                  if (addTestResourceChecked) {
                    products.forEach((product) => {
                      if (product.checked) {
                        // get en and fr products from testProducts and dispatch
                        const testProduct = testProducts.filter((tp) => {
                          return tp.nid === product.nid;
                        });
                        replaceProductWithTestProduct(testProduct);
                        // dispatch if bookmarked
                        if (
                          bookmarksInStore.some((bm) => {
                            return bm.nid === product.nid;
                          })
                        ) {
                          replaceBookmarkWithTestProduct([...testProduct]);
                        }
                      }
                    });
                    navStacks();
                  }
                  await dispatchPushNotificationToAll(
                    titleTextEn,
                    messageTextEn,
                    titleTextFr,
                    messageTextFr,
                    products,
                    linkText.toLowerCase()
                  );
                }}
                text={t('home.pushNotification.button.sendTitle.all')}
                lIconName="share"
              />
            </View>
            <View style={{ width: '100%', justifyContent: 'center' }}>
              <Touch
                onPress={async () => {
                  if (
                    messageTextEn.length === 0 &&
                    messageTextFr.length === 0
                  ) {
                    Alert('Please enter a message.');
                    return;
                  }
                  if (
                    (messageTextEn.length > 0 && titleTextEn.length === 0) ||
                    (messageTextFr.length > 0 && titleTextFr.length === 0)
                  ) {
                    Alert('Please enter a title.');
                    return;
                  }
                  if (
                    linkText.length > 0 &&
                    !(
                      linkText.toLowerCase().startsWith('https://') ||
                      linkText.toLowerCase().startsWith('http://')
                    )
                  ) {
                    Alert('Please enter a valid external link.');
                    return;
                  }
                  if (addTestResourceChecked) {
                    products.forEach((product) => {
                      if (product.checked) {
                        // get en and fr products from testProducts and dispatch
                        const testProduct = testProducts.filter((tp) => {
                          return tp.nid === product.nid;
                        });
                        replaceProductWithTestProduct(testProduct);
                        // dispatch if bookmarked
                        if (
                          bookmarksInStore.some((bm) => {
                            return bm.nid === product.nid;
                          })
                        ) {
                          replaceBookmarkWithTestProduct([...testProduct]);
                        }
                      }
                    });
                    navStacks();
                  }
                  await dispatchPushNotificationToSelf(
                    titleTextEn,
                    messageTextEn,
                    titleTextFr,
                    messageTextFr,
                    products,
                    linkText.toLowerCase()
                  );
                }}
                text={t('home.pushNotification.button.sendTitle.self')}
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
          </View>
        </View>
        <View style={gStyle.spacer32} />
      </ScrollView>
    </View>
  );
};

async function dispatchPushNotificationToAll(
  titleTextEn,
  messageTextEn,
  titleTextFr,
  messageTextFr,
  products,
  linkText
) {
  const nids = [];
  products.forEach((product) => {
    if (product.checked) {
      nids.push(product.nid);
    }
  });
  const message = [];
  if (messageTextEn.length > 0) {
    message.push({
      to: 'en',
      title: titleTextEn,
      body: messageTextEn,
      data: {
        products: nids.length > 0 ? nids : null,
        link: linkText
      }
    });
  }
  if (messageTextFr.length > 0) {
    message.push({
      to: 'fr',
      title: titleTextFr,
      body: messageTextFr,
      data: {
        products: nids.length > 0 ? nids : null,
        link: linkText
      }
    });
  }
  sendPushNotification(message);
}

async function dispatchPushNotificationToSelf(
  titleTextEn,
  messageTextEn,
  titleTextFr,
  messageTextFr,
  products,
  linkText
) {
  notifications.retrieveExpoPushToken().then((expoPushToken) => {
    const nids = [];
    products.forEach((product) => {
      if (product.checked) {
        nids.push(product.nid);
      }
    });
    const message = [];
    if (messageTextEn.length > 0) {
      message.push({
        to: expoPushToken,
        title: titleTextEn,
        body: messageTextEn,
        data: {
          products: nids.length > 0 ? nids : null,
          link: linkText
        }
      });
    }
    if (messageTextFr.length > 0) {
      message.push({
        to: expoPushToken,
        title: titleTextFr,
        body: messageTextFr,
        data: {
          products: nids.length > 0 ? nids : null,
          link: linkText
        }
      });
    }
    sendPushNotification(message);
  });
}

PushNotificationScreen.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default PushNotificationScreen;
