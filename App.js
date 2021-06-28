/* eslint-disable no-console */
import * as React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Appearance } from 'react-native-appearance';
import { Provider as ReactProvider } from 'react-redux';
import { createStore } from 'redux';
import he from 'he';
import * as PushNotifications from 'expo-notifications';
import * as Localization from 'expo-localization';
import * as I18n from './src/config/i18n';
import { device, func } from './src/constants';
import { lang } from './src/constants/constants';
import { fetchProductsAsync } from './src/api/covid19Products';
import {
  notifications,
  productLoad,
  productsParser,
  storage
} from './src/services';
import initialState from './src/redux/store/initialState';
import rootReducer from './src/redux/store/store';

// tab navigator
import MainStack from './src/navigation/Stack';

// set notification handler for when app is in the foreground
PushNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      theme: 'light'
    };

    I18n.setLocale(Localization.locale);

    this.updateTheme = this.updateTheme.bind(this);
    this.retrieveLanguagePreference = this.retrieveLanguagePreference.bind(this);
    this.saveBookmark = this.saveBookmark.bind(this);
    this.retrieveBookmarks = this.retrieveBookmarks.bind(this);
    this.fetchProducts = this.fetchProducts.bind(this);
    this.loadInitialStateAsync = this.loadInitialStateAsync.bind(this);
    this.loadResourcesAsync = this.loadResourcesAsync.bind(this);
  }

  componentDidMount() {
    // get system preference
    const colorScheme = Appearance.getColorScheme();

    // if light or dark
    if (colorScheme !== 'no-preference') {
      this.setState({
        theme: colorScheme
      });
    }

    notifications.registerForPushNotificationsAsync();

    // this listener is fired whenever a notification is received while the app is foregrounded
    PushNotifications.addNotificationReceivedListener(this.handleNotification);

    // this listener is fired whenever a user taps on or interacts with a notification
    // note: this is supposed to work when app is foregrounded, backgrounded, or killed
    PushNotifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse
    );
  }

  handleNotification = (notification) => {
    // this.setState({ notification: notification });
    // console.log('addNotificationReceivedListener (fired whenever a notification is received while the app is foregrounded)...');
    // console.log('notification received while app is foregrounded: ', notification);
  };

  handleNotificationResponse = (response) => {
    // console.log('addNotificationResponseReceivedListener (fired whenever a user taps on or interacts with a notification)...');
    // console.log('notification received, response: ', response);
  };

  retrieveLanguagePreference = async () => {
    try {
      const value = await storage.retrieve('language');
      return value;
    } catch (error) {
      return null;
    }
  };

  saveBookmark = async (bookmark) => {
    try {
      const key = 'bookmark-product'.concat(
        bookmark.nid
          .concat('-')
          .concat(bookmark.language.toLowerCase().substring(0, 2))
      );
      await storage.save(key, JSON.stringify(bookmark));
    } catch (error) {
      console.log('Unable to sync bookmark with product. ', error);
    }
  };

  retrieveBookmarks = async (syncWithProduct) => {
    let keys = [];
    let storedBookmarks = [];
    const bookmarks = [];
    try {
      keys = await storage.retrieveKeys();
      if (keys.length > 0) {
        keys = keys.filter((key) => {
          return key.startsWith('bookmark-product');
        });
        storedBookmarks =
          keys !== null ? await storage.retrieveMulti(keys) : [];
        storedBookmarks.map((storedBookmark) => {
          const bookmark = JSON.parse(storedBookmark[1]);
          if (syncWithProduct) {
            const product = initialState.products.filter((p) => {
              return p.language === bookmark.language && p.nid === bookmark.nid;
            });
            if (product.length === 1) {
              // scrape product consumer information (not in api), then add and save bookmark
              const consumerInformationResource = [];
              const resourceLang = product[0].language
                .toLowerCase()
                .substring(0, 2);
              consumerInformationResource.push(
                product[0].resources.find((r) => {
                  if (productsParser.isProductResourceNameConsumerInfo(r.resource_link)) {
                    return r;
                  }
                })
              );
              productLoad
                .loadConsumerInformation(
                  productsParser.getProductResourceLink(
                    consumerInformationResource[0],
                    resourceLang
                  ),
                  resourceLang
                )
                .then((productPortalInfo) => {
                  product[0].productMetadata =
                    productPortalInfo.productMetadata;
                  product[0].consumerInformation =
                    productPortalInfo.consumerInformation;
                  product[0].regulatoryAnnouncements =
                    productPortalInfo.regulatoryAnnouncements;
                  bookmarks.push(product[0]);
                  // update storage async
                  this.saveBookmark(product[0]);
                });
            } else {
              bookmarks.push(bookmark);
            }
          } else {
            bookmarks.push(bookmark);
          }
        });
      }
    } catch (error) {
      console.log('Unable to get bookmarks from storage. ', error);
    }
    return bookmarks;
  };

  fetchProducts = async () => {
    let products = [];
    try {
      products = await fetchProductsAsync();
      products = JSON.parse(he.decode(JSON.stringify(products))); // using he to decode html entities, but may want to review other ways to parse
    } catch (error) {
      console.log('Could not fetch Covid-19 Products from api. ', error);
    }
    return products;
  };

  loadInitialStateAsync = async () => {
    try {
      initialState.products = await this.fetchProducts();
      initialState.settings.isOnline = initialState.products.length > 0;
      initialState.bookmarks = await this.retrieveBookmarks(
        initialState.settings.isOnline
      );

      const langPref = await this.retrieveLanguagePreference();
      if (
        langPref !== null &&
        (langPref === lang.english || langPref === lang.french)
      ) {
        // user has selected language
        initialState.settings.language = langPref;
        I18n.setLocale(langPref);
      } else {
        // user has never selected language (or error), default to device locale (or en if not en or fr)
        initialState.settings.language = I18n.getCurrentLocale();
      }
    } catch (error) {
      console.log(
        'Unhandled error occured while loading initial state. ',
        error
      );
    }
  };

  loadResourcesAsync = async () => {
    return this.loadInitialStateAsync().then(() => {
      return func.loadAssetsAsync;
    });
  };

  updateTheme(themeType) {
    this.setState({
      theme: themeType
    });
  }

  render() {
    const { isLoading, theme } = this.state;
    const iOSStatusType = theme === 'light' ? 'dark-content' : 'light-content';

    if (isLoading) {
      return (
        <AppLoading
          onError={console.warn}
          onFinish={() => this.setState({ isLoading: false })}
          startAsync={this.loadResourcesAsync}
        />
      );
    }

    // redux
    const store = createStore(rootReducer, initialState);

    // products state is now set and available for connect() within ReactProvider - console.log('store.getState.products.length: ', store.getState().products.length);

    return (
      <ReactProvider store={store}>
        <React.Fragment>
          <StatusBar barStyle={device.iOS ? iOSStatusType : 'light-content'} />
          <MainStack
            screenProps={{
              updateTheme: this.updateTheme
            }}
            theme={theme}
          />
        </React.Fragment>
      </ReactProvider>
    );
  }
}

export default App;
