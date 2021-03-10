import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ButtonGroup, Card } from 'react-native-elements';
import cheerio from 'react-native-cheerio';
//import { useTheme } from 'react-navigation';
//import { gStyle } from '../constants';

// components
import ViewProductMasters from './ViewProductMasters';

export default class ViewCovid19Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      authorizedProducts: [],
      applicationProducts: []
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex (selectedIndex) {
    this.setState({ selectedIndex });
  }

  /*************************************************************************************
   * 1. Determine the appropriate url to use to load Product Master data (EN/FR)
   * 2. Fetch an HTML Page and load it into Cheerio
   * 3. Extract Vaccine and Treatment Product Masters for Approved and Applied Products
   * 4. Add Approved and Applied Product Masters to Component State
   */

  componentDidMount() {
    var url = (global.language === 'en-ca') ? "https://covid-vaccine.canada.ca" : "https://vaccin-covid.canada.ca";
    fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 

      var productMasterLists = this.scrapeProductMasterLists(text); 
      this.setState(productMasterLists);
    }).catch(error => {
      console.log('VC19P: could not load url ' + url);
    });      
  }

  render() {
//    const theme = useTheme();
    const buttons = ['Authorized Products', 'Other Applications'];
    const { selectedIndex } = this.state;

    return (
      <View style={{ flex: 1 }} >
        <Card style={{ flex: 1 }}>
          <Card.Title>COVID-19 Vaccines and Treatments</Card.Title>
          <Text>Select from authorized COVID-19 Vaccines and Treatments, or all unauthorized applications.</Text>
        </Card>
        <ButtonGroup
          onPress = { this.updateIndex }
          selectedIndex = { selectedIndex }
          buttons = { buttons }
          containerStyle = {{ height: 30, marginLeft: 14, marginRight: 14 }}
        />
        <ScrollView>
          { (this.state.selectedIndex === 0) &&
              <ViewProductMasters
                productMasters={this.state.authorizedProducts}
                navigation={this.props.navigation} 
                width={this.props.width}
              />
          }
          { (this.state.selectedIndex === 1) &&
              <ViewProductMasters
                productMasters={this.state.applicationProducts}
                navigation={this.props.navigation} 
                width={this.props.width}
              />
          }
        </ScrollView>
      </View>
    );
  }

   /*************************************************************************************
   * 1. Using supplied response text, fetch an HTML Page and load it into Cheerio
   * 2. Extract Vaccine and Treatment Product Masters for Approved and Applied Products
   * 3. Add Approved and Applied Product Masters to Component State
   */
  scrapeProductMasterLists (responseText) {
      var $ = cheerio.load(responseText);
      var productRows = $('.view-vaccine-table table tbody').find('tr');
      var authorizedProducts = [], applicationProducts = [];
      productRows.each((i, product) => {

        // Scrape the Product Master from each table row:
        var productMaster = {
          key: i, link: null, brandName: null, companyName: null, type: null, status: null, approvalDate: null
        }
        var productCells = $(product).find('td');
        productCells.each((j, cell) => {
          switch (j) {
            case 0: productMaster.brandName = $(cell).text().trim(); break;
            case 1: productMaster.companyName = $(cell).text().trim(); break;
            case 2: productMaster.type = $(cell).text().trim(); break;
            case 3: productMaster.status = $(cell).text().trim(); break;
            case 4: productMaster.approvalDate = $(cell).text().trim(); break;
          }
        });

        // Special logic based on retrieving links for authorized products
        if ($(product).find('a').html() != null) {
          productMaster.link = $(product).find('a').attr('href');
          productMaster.name = $(product).find('a').html();
          authorizedProducts.push(productMaster);
        } else {
          productMaster.name = $(product).find('td').html();
          applicationProducts.push(productMaster);
        }

        console.log(authorizedProducts);
      });

      return {
        authorizedProducts: authorizedProducts,
        applicationProducts: applicationProducts
      }
  }

}