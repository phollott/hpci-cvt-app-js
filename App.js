/* eslint-disable no-console */
import * as React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Appearance } from 'react-native-appearance';
import { Provider as ReactProvider } from 'react-redux';
import { createStore } from 'redux';
import * as Localization from 'expo-localization';
import * as I18n from './src/config/i18n';
import { device, func } from './src/constants';
import { lang } from './src/constants/constants';
import {
  bookmarkStorage,
  languageStorage,
  notifications,
  productLoad,
  settingsStorage
} from './src/services';
import initialState from './src/redux/store/initialState';
import rootReducer from './src/redux/store/store';

// tab navigator
import MainStack from './src/navigation/Stack';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      theme: 'light'
    };

    I18n.setLocale(Localization.locale);

    this.updateTheme = this.updateTheme.bind(this);
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

    notifications.registerNotificationHandler();

    // get expo token, may prompt ios users for permission
    notifications
      .registerForPushNotificationsAsync()
      .then((token) =>
        notifications.registerDeviceToken(token, I18n.getCurrentLocale())
      );
  }

  loadInitialStateAsync = async () => {
    try {
      initialState.products = await productLoad.fetchProducts();
      initialState.settings.isOnline = initialState.products.length > 0;
      initialState.bookmarks = await bookmarkStorage.retrieveBookmarks(
        initialState.products
      );

      const langPref = await languageStorage.retrieveLanguage();
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

      initialState.settings.notifications = await settingsStorage.retrieveNotificationsSettings();
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
