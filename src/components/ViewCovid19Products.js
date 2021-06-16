import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { ButtonGroup, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';
import { productType } from '../constants/constants';
import { selectProducts } from '../redux/selectors/productSelector';
import { productMaster } from '../services';

// components
import ViewCardText from './ViewCardText';
import ViewProductMasters from './ViewProductMasters';

const internalState = {
  searchText: '',
  selectedIndex: 0,
  filtVaccineProd: [],
  filtTreatmentProd: []
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
    const filteredVaccineProducts = this.props.vaccineProducts.filter((item) => {
      const itemData = item.searchKey
      return itemData.indexOf(searchLowercase) > -1
    });
    const filteredTreatmentProducts = this.props.treatmentProducts.filter((item) => {
      const itemData = item.searchKey
      return itemData.indexOf(searchLowercase) > -1
    });
    this.setState({ 
      filtVaccineProd: filteredVaccineProducts,
      filtTreatmentProd: filteredTreatmentProducts,
      searchText: searchText
     });
  }

  // ButtonGroup selected index is local to this screen, so it should remain in the localstate
  updateIndex (selectedIndex) {
    this.setState({ selectedIndex });
  }

  /*************************************************************************************
   * 1. Extract from redux store Vaccine and Treatment Product Masters for Approved Products
   * 2. Add filtered Vaccine and Treatment Product Masters to Component State
   */
  componentDidMount() {
    this.setState({
      filtVaccineProd: this.props.vaccineProducts,
      filtTreatmentProd: this.props.treatmentProducts
    });
  }

  render() {
    const buttons = [ t('products.buttons.left'), t('products.buttons.right') ];
    const { selectedIndex } = this.state;
    const { searchText } = this.state;
    if (this.props.settings.isOnline) {
      return (
        <>
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
            <ViewCardText title={ t('products.card.title') } text={ t('products.card.instructionText') } />
            <ButtonGroup
              onPress = { this.updateIndex }
              selectedIndex = { selectedIndex }
              buttons = { buttons }
              containerStyle={{ height: 30, marginHorizontal: 14 }}
              selectedButtonStyle={{ backgroundColor: colors.darkColor }}
            />
            <View>
              { (this.state.selectedIndex === 0 && this.state.filtVaccineProd.length > 0) &&
                <ViewProductMasters
                  productMasters={this.state.filtVaccineProd}
                  navigation={this.props.navigation}
                />
              }
              { (this.state.selectedIndex === 1 && this.state.filtTreatmentProd.length > 0) &&
                <ViewProductMasters
                  productMasters={this.state.filtTreatmentProd}
                  navigation={this.props.navigation}
                />
              }
              { (this.state.selectedIndex === 0 && this.state.filtVaccineProd.length === 0) &&
                <ViewCardText text={ t('products.emptyText.left') } />
              }
              { (this.state.selectedIndex === 1 && this.state.filtTreatmentProd.length === 0) &&
                <ViewCardText text={ t('products.emptyText.right') } />
              }
            </View>
          </ScrollView>
        </View>
        </>
      );
    } else {
      return (
        <>
          <View style={gStyle.spacer8} />
          <ViewCardText text={ t('products.card.offlineText') } />
        </>
      );
    }
  }
}

const mapStateToProps = (state) => {
  var vaccineProducts = [], treatmentProducts = [];

  selectProducts(state).forEach((prod, i) => {
    let product = productMaster.mapProduct(prod, i, state.settings.language);
    if ( product.type === productType.vaccine ) {
      vaccineProducts.push(product);
    } else {
      treatmentProducts.push(product);
    }
  });

  return {
    settings: state.settings,
    vaccineProducts: vaccineProducts.sort((a, b) => (a.brandName > b.brandName) ? 1 : -1),
    treatmentProducts: treatmentProducts.sort((a, b) => (a.brandName > b.brandName) ? 1 : -1)
  };
};

export default connect(mapStateToProps)(ViewCovid19Products);
