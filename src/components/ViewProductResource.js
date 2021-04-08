import React, { Component } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import cheerio from 'react-native-cheerio';
import { connect } from 'react-redux';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';

class ViewProductResource extends Component {
  webview = null;

  constructor(props) {
    super(props);
    this.state = {
      productResourceHtml: 'loading...'
    };
  }

  /*************************************************************************************
   * 1. Determine the appropriate url to use to load Product Resource data (EN/FR)
   * 2. Fetch an HTML Page and load it into Cheerio
   * 3. Extract Product Resource details
   * 
   * Rendering does not work as expected for Resources that contain ?linkID in link
   */

  componentDidMount() {
    const cvtPortal = (this.props.settings.language === lang.english) ? covidVaccinePortal : portailVaccinCovid;
    var productResource = this.props.route.params.productResource,
      url = cvtPortal,
      cssUrl = url + '/info/GCWeb/css/theme.min.css';
    url += productResource.link;

    fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 
      var $ = cheerio.load(text),
        $$ = cheerio.load('<html><head><link href="' + cssUrl + '" rel="stylesheet"/></head></html>');

      $('a').each((i, elem) => {
        var href = $(elem).attr("href");
        if (typeof href !== "undefined" && !href.startsWith("http") && !href.startsWith("#")) {
          $(elem).attr("href", cvtPortal + "/info/" + href).html();
        }
      });
      
      var prodResourceBlock = $('main');

      // note: removing container class so margins can be set (not all pages have this class, so this also makes for consistent margins)
      $$('body').append($('main').removeClass('container').html());
      
      //console.log('page html for [' + url + ']: ' + prodResourceBlock.html())

      if (productResource.resourceName === 'Consumer Information' || productResource.resourceName.toLowerCase().includes('consommateurs')) {
        //console.log('this is consumer information, so let us slice')
        var $$$ = cheerio.load('<html><head><link href="' + cssUrl + '" rel="stylesheet"/></head></html>');
        $$$('body').append('<table class="table table-hover table-bordered table-responsive">' 
          + $('table').html() + '</table><hr/>');
        $('div').has('details.span-8').each((i, detail) => {
          $$$('body').append($(detail).html())
        });
      }

      this.setState({
        productResourceHtml: $$.html(),
        highlyExperimentalLettuceSlice: $$$.html()
      });

    }).catch(error => {
      // TODO
      // for testing...
      this.setState({productResourceHtml: "<p>Unable to load: <a href='" + url + "'>" + url + "</a></p>"});
      console.log('VPR: could not load url ' + url);
    });
  }

  render() {
    return (
      <View style={ styles.container }>
        <WebView style={ styles.resourceContainer }
          originWhitelist={['*']}
          source={{ html: this.state.productResourceHtml }}
          ref={ (ref) => (this.webview = ref) }
          onNavigationStateChange={ this.handleWebViewNavigationStateChange }
        />
      </View>
    );
  }

  handleWebViewNavigationStateChange = (newNavState) => {
    // newNavState looks something like this: { url?: string; title?: string; loading?: boolean; canGoBack?: boolean; canGoForward?: boolean; }
    const { url } = newNavState;
    if (!url || url == 'about:blank') return;
    if (url.startsWith('http')) {
      //console.log( "handleWebViewNavigationStateChange url: ", url );
      
      // open url within ext browser, not within webview
      const redirectTo = 'window.location = "about:blank"';
      this.webview.injectJavaScript(redirectTo);

      // delay nav to ProductDetails, and open url in browser
      setTimeout(() => {
        this.props.navigation.navigate('ProductDetails');
      }, 500);

      Linking.canOpenURL(url).then( supported => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    }
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  resourceContainer: {
    flex: 1,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 0,
    marginBottom: 0
  }
});

const mapStateToProps = (state) => {
  //console.log('state.settings: ', state.settings);
  return {
    settings: state.settings
  };
};

export default connect(mapStateToProps)(ViewProductResource);
