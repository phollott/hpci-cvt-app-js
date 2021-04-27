import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ButtonGroup, Card, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import { lang } from '../constants/constants';
import { selectAuthorizedProducts, selectUnauthorizedProducts } from '../redux/selectors/productSelector';

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
    const buttons = [ t('products.buttons.authorized'), t('products.buttons.application') ];
    const { selectedIndex } = this.state;
    const { searchText } = this.state;
    return (
      <View 
        style={{ flex: 1 }}
        contentContainerStyle={gStyle.contentContainer}
      >
        <SearchBar
          placeholder={ t('products.searchBar.placeholder') }
          onChangeText={ this.updateSearch }
          value={ searchText }
        />
        <ScrollView>
          <Card>
            <Text>{ t('products.card.instructionText') }</Text>
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

  // Authorized Products:
  selectAuthorizedProducts(state).forEach((product, i) => {
    var productMaster = {
      key: i, 
      nid: product.nid,
      link: true,
      brandName: product.brand_name, 
      ingredient: product.ingredient, 
      companyName: product.company_name, 
      type: 'Vaccine',                                                                                           // TODO: **** determine if Vaccine or Treatment, type is not in api!
      status: product.status, 
      approvalDate: product.date_of_approval,
    };
    if (typeof product.body_text !== "undefined" && product.body_text !== null) {
      if (product.body_text.includes('/vaccines/') || product.body_text.includes('/vaccins/')) {                 // TODO: **** using body_text is a hack, type is not in api!
        productMaster.type = lang.english === state.settings.language ? 'Vaccine' : 'Vaccin';
      }
      else if (product.body_text.includes('/treatments/') || product.body_text.includes('/traitements/')) {
        productMaster.type = lang.english === state.settings.language ? 'Treatment' : 'Traitement';
      }
    }
    productMaster.searchKey = [productMaster.brandName, productMaster.companyName, productMaster.ingredient].join('-').toLowerCase();
    authorizedProducts.push(productMaster);
  });
  
  // Application Products:
  selectUnauthorizedProducts(state).forEach((product, i) => {
    var productMaster = {
      key: i, 
      nid: product.nid,
      link: null, 
      brandName: product.brand_name, 
      ingredient: product.ingredient, 
      companyName: product.company_name, 
      type: lang.english === state.settings.language ? 'Treatment' : 'Traitement',                               // TODO: **** determine if Vaccine or Treatment, type is not in api!
      status: product.status, 
      approvalDate: product.date_of_approval
    };
    if (product.brand_name.toLowerCase().includes('vaccin')) {
      productMaster.type = lang.english === state.settings.language ? 'Vaccine' : 'Vaccin';                      // TODO: **** determine if Vaccine or Treatment, type is not in api!
    }
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
