import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ButtonGroup, Card, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { gStyle } from '../constants';

// components
import ViewProductMasters from './ViewProductMasters';

const internalState = {
  searchText: '',
  selectedIndex: 0,
  filtAuthProd: [],
  filtApplProd: []
};

class ViewCovid19Products extends Component {
  constructor(props) {
    super(props);
    this.state = internalState;
    this.updateIndex = this.updateIndex.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  // SearchBar
  updateSearch = (searchText) => {
    var searchLowercase = searchText.toLowerCase();
    const filteredAuthProducts = this.props.authorizedProducts.filter((item) => {
      const itemData = item.searchKey
      return itemData.indexOf(searchLowercase) > -1
    });
    const filteredApplProducts = this.props.applicationProducts.filter((item) => {
      const itemData = item.searchKey
      return itemData.indexOf(searchLowercase) > -1
    });
    this.setState({ 
      filtAuthProd: filteredAuthProducts,
      filtApplProd: filteredApplProducts,
      searchText: searchText
     });
  }

  // ButtonGroup selected index is local to this screen, so it should remain in the localstate
  updateIndex (selectedIndex) {
    this.setState({ selectedIndex });
  }

  /*************************************************************************************
   * 1. Extract from redux store Vaccine and Treatment Product Masters for Approved and Applied Products
   * 2. Add filtered Approved and Applied Product Masters to Component State
   */
  componentDidMount() {
    this.setState({
      filtAuthProd: this.props.authorizedProducts,
      filtApplProd: this.props.applicationProducts
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
}

const mapStateToProps = (state) => {

  var authorizedProducts = [], applicationProducts = [];

  // TODO: **** get bus req for both filters!
  
  // Authorized Products:
  const authProducts = state.products.filter(item => {
    return item.language == state.settings.language 
      && item.resources.length > 0
      && -1 < item.resources.findIndex(resource => { return resource.resource_link.includes('href=') } )
  });
  
  authProducts.forEach((product, i) => {
    var productMaster = {
      key: i, 
      nid: product.nid,
      link: null,                               // TODO: **** determine how to get link, product-details link is not in api! -> link still used to determine if there are product details
      brandName: product.brand_name, 
      ingredient: product.ingredient, 
      companyName: product.company_name, 
      type: 'Vaccine',                          // TODO: **** determine if Vaccine or Treatment, type is not in api!
      status: product.status, 
      approvalDate: product.date_of_approval,
    };
    productMaster.link = typeof product.body_text !== "undefined" && product.body_text !== null 
      ? product.body_text.match(/href="([^"]*)/)[1] : null;    // TODO: **** hack! is body_text okay to use? this is the What you should know link
    productMaster.searchKey = [productMaster.brandName, productMaster.companyName, productMaster.ingredient].join('-').toLowerCase();
    authorizedProducts.push(productMaster);
  });
  
  // Application Products:
  const applProducts = state.products.filter(item => {
    return item.language == state.settings.language
      && item.body_text === null
      && item.resources.length === 0
      && !item.title.toLowerCase().startsWith('demo vaccine')
      && !item.title.toLowerCase().startsWith('test')
  });
  
  applProducts.forEach((product, i) => {
    var productMaster = {
      key: i, 
      nid: product.nid,
      link: null, 
      brandName: product.brand_name, 
      ingredient: product.ingredient, 
      companyName: product.company_name, 
      type: 'Vaccine',                          // TODO: **** determine if Vaccine or Treatment, type is not in api!
      status: product.status, 
      approvalDate: product.date_of_approval
    };
    productMaster.searchKey = [productMaster.brandName, productMaster.companyName].join('-').toLowerCase();
    applicationProducts.push(productMaster);
  });
  
  return {
    settings: state.settings,
    authorizedProducts: authorizedProducts,
    applicationProducts: applicationProducts
  };
};

export default connect(mapStateToProps)(ViewCovid19Products);
