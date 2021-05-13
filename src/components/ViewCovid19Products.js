import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ButtonGroup, Card, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import { selectAuthorizedProducts, selectUnauthorizedProducts } from '../redux/selectors/productSelector';
import { productMaster } from '../services';

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
    if (this.props.settings.isOnline) {
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
          <View style={gStyle.spacer8} />
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
    } else {
      return (
        <View>
          <View style={gStyle.spacer32} />
          <View contentContainerStyle={gStyle.contentContainer}>
            <Card>
              <Text style={{fontSize: 16}}>{ t('products.card.offlineText') }</Text>
            </Card>
          </View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => {
  var authorizedProducts = [], applicationProducts = [];

  // Authorized Products:
  selectAuthorizedProducts(state).forEach((product, i) => {
    authorizedProducts.push(productMaster.mapAuthorizedProduct(product, i));
  });
  
  // Application Products:
  selectUnauthorizedProducts(state).forEach((product, i) => {
    applicationProducts.push(productMaster.mapUnauthorizedProduct(product, i));
  });
  
  return {
    settings: state.settings,
    authorizedProducts: authorizedProducts.sort((a, b) => (a.brandName > b.brandName) ? 1 : -1),
    applicationProducts: applicationProducts.sort((a, b) => (a.brandName > b.brandName) ? 1 : -1)
  };
};

export default connect(mapStateToProps)(ViewCovid19Products);
