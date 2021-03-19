import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ButtonGroup, Card, SearchBar } from 'react-native-elements';
import cheerio from 'react-native-cheerio';
import { gStyle } from '../constants';

// components
import ViewProductMasters from './ViewProductMasters';

export default class ViewCovid19Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      selectedIndex: 0,
      authorizedProducts: [],
      filtAuthProd: [],
      applicationProducts: [],
      filtApplProd: []
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  // SearchBar
  updateSearch = (searchText) => {
    var searchLowercase = searchText.toLowerCase();
    const filteredAuthProducts = this.state.authorizedProducts.filter((item) => {
      const itemData = item.searchKey
      return itemData.indexOf(searchLowercase) > -1
    });
    const filteredApplProducts = this.state.applicationProducts.filter((item) => {
      const itemData = item.searchKey
      return itemData.indexOf(searchLowercase) > -1
    });
    this.setState({ 
      filtAuthProd: filteredAuthProducts,
      filtApplProd: filteredApplProducts,
      searchText: searchText
     });
  }

  // ButtonGroup selected index is local to this screen, so it should remain in the
  // localstate, whereas the two product collections belong in the redux store
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
    const buttons = ['Authorized Products', 'Other Applications'];
    const { selectedIndex } = this.state;
    const { searchText } = this.state;

    return (
      <View 
        style={{ flex: 1 }}
        contentContainerStyle={gStyle.contentContainer}
      >
        <SearchBar
          placeholder="Search for Vaccines and Treatments..."
          onChangeText={ this.updateSearch }
          value={ searchText }
        />
        <ScrollView>
          <Card>
            <Text>Select from authorized COVID-19 Vaccines and Treatments, or all unauthorized applications.</Text>
          </Card>
          <ButtonGroup
            onPress = { this.updateIndex }
            selectedIndex = { selectedIndex }
            buttons = { buttons }
          />
          <View>
            { (this.state.selectedIndex === 0) &&
                <ViewProductMasters
                  productMasters={this.state.filtAuthProd}
                  navigation={this.props.navigation} 
                />
            }
            { (this.state.selectedIndex === 1) &&
                <ViewProductMasters
                  productMasters={this.state.filtApplProd}
                  navigation={this.props.navigation} 
                />
            }
          </View>
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
          key: i, link: null, brandName: null, ingredient: null, companyName: null, type: null, status: null, approvalDate: null
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

        // add a search key to each product for ease of searching
        productMaster.searchKey = [productMaster.brandName, productMaster.companyName].join('-').toLowerCase();

        // Special logic based on retrieving links for authorized products
        if ($(product).find('a').html() != null) {
          var productName = $(product).find('a').html();
          productMaster.ingredient = productMaster.brandName.replace(productName, '').trim();
          productMaster.brandName = productName;
          productMaster.link = $(product).find('a').attr('href');
          authorizedProducts.push(productMaster);
        } else {
          // There is no easy way to get ingredient out of brandName for these products
          productMaster.name = $(product).find('td').html();
          applicationProducts.push(productMaster);
        }
//        console.log(applicationProducts);
      });

      return {
        authorizedProducts: authorizedProducts,   filtAuthProd: authorizedProducts,
        applicationProducts: applicationProducts, filtApplProd: applicationProducts
      }
  }

}