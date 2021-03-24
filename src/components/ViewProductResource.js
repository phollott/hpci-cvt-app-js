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
      url = (global.language === 'en-ca') ? "https://covid-vaccine.canada.ca" : "https://vaccin-covid.canada.ca";
    url += productResource.link;
    
    fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 
      var $ = cheerio.load(text),
        prodResourceBlock = $('main');
//      console.log('page html for [' + url + ']: ' + prodResourceBlock.html())

      var $$ = cheerio.load("<h3>Consumer Information</h3>")
      if (productResource.resourceName === 'Consumer Information') {
        console.log('this is consumer information, so let us slice')
        $('div').has('details.span-8').each((i, detail) => {
          $$('body').append($(detail).html())
        });
      }

      this.setState({
        productResourceHtml: prodResourceBlock.html(),
        highlyExperimentalLettuceSlice: $$.html()
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
          scalesPageToFit
        />
      </View>
    );
  }

}