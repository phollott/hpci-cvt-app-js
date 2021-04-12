import * as React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Appearance } from 'react-native-appearance';
import { device, func } from './src/constants';
import { lang } from './src/constants/constants';
import { fetchProductsAsync } from './src/api/covid19Products';
import initialState from './src/redux/store/initialState';
import rootReducer from './src/redux/store/store';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import he from 'he';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import * as I18n from './src/config/i18n';

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
    this.getLanguagePreference = this.getLanguagePreference.bind(this);
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
  }

  getLanguagePreference = async () => {
    try {
      return value = await AsyncStorage.getItem('language');
    } catch (error) {
      return null;
    }
  }

  loadInitialStateAsync = async () => {
    try {
      const products = await fetchProductsAsync();
      initialState.products = JSON.parse(he.decode(JSON.stringify(products)));    // [mrj] TODO: using he to decode html entities, but may want to review other ways to parse

      const langPref = await this.getLanguagePreference();
      if (langPref !== null && (langPref === lang.english || langPref === lang.french)) {
        // user has selected language
        initialState.settings.language = langPref;  // redux (createStore)
        I18n.setLocale(langPref);
      } else {
        // user has never selected language (or error), default to device locale (or en if not en or fr)
        initialState.settings.language = I18n.getCurrentLocale();
      }
    }
    catch (error) {
      // [mrj] TODO: consider offline and get bookmarks from storage?
      initialState.settings.isOnline = false;
      console.log('Could not fetch Covid-19 Products from api.', error);
    }
  }
  
  loadResourcesAsync = async () => {
    // fetch products and load assets
    return this.loadInitialStateAsync().then(() => { return func.loadAssetsAsync });
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
    const store = createStore(rootReducer, initialState)

    // [mrj] products state is now set and available for connect() within Provider - console.log('store.getState.products.length: ', store.getState().products.length);

    return (
      <Provider store={store} >
        <React.Fragment>
          <StatusBar barStyle={device.iOS ? iOSStatusType : 'light-content'} />
          <MainStack
            screenProps={{
              updateTheme: this.updateTheme
            }}
            theme={theme}
          />
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
