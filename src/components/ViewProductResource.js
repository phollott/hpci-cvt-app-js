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
   */

  componentDidMount() {
    var productResourceIn = this.props.navigation.state.params.productResource,
      url = (global.language === 'en-ca') ? "https://covid-vaccine.canada.ca" : "https://vaccin-covid.canada.ca";
    url += productResourceIn.link;
    
    fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 
      var $ = cheerio.load(text),
        prodResourceBlock = $('main');

      this.setState({
        productResourceHtml: prodResourceBlock.html()
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