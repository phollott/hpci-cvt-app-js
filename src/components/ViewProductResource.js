import React, { Component } from 'react';
import { View } from 'react-native';
//import { Card, ListItem } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import cheerio from 'react-native-cheerio';

export default class ViewProductResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productResourceHtml: 'none'
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
    var productResource = this.props.route.params.productResource,
      url = (global.language === 'en-ca') ? "https://covid-vaccine.canada.ca" : "https://vaccin-covid.canada.ca",
      cssUrl = url + '/info/GCWeb/css/theme.min.css';
    url += productResource.link;

    fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 
      var $ = cheerio.load(text),
        $$ = cheerio.load('<html><head><link href="' + cssUrl + '" rel="stylesheet"/></head></html>'),
        prodResourceBlock = $('main');

      $$('body').append($('main').html());
      
//      console.log('page html for [' + url + ']: ' + prodResourceBlock.html())

      if (productResource.resourceName === 'Consumer Information') {
        console.log('this is consumer information, so let us slice')
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
      console.log('VPR: could not load url ' + url);
    });
  }

  render() {
    return (
      <View style={{ flex: 1}}>
        <WebView style={{ flex: 1 }}
          originWhitelist={['*']}
          source={{ html: this.state.productResourceHtml }}
          style={{ marginTop: 0 }}
        />
      </View>
    );
  }

}