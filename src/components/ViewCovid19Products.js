import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import { productType } from '../constants/constants';
import { selectProducts } from '../redux/selectors/productSelector';
import { productMaster } from '../services';

// components
import ViewButtonGroup from './ViewButtonGroup';
import ViewCardText from './ViewCardText';
import ViewProductMasters from './ViewProductMasters';

const internalState = {
  filtVaccineProd: [],
  filtTreatmentProd: [],
  selectedIndex: 0,
  searchText: ''
};

class ViewCovid19Products extends Component {
  constructor(props) {
    super(props);
    this.state = internalState;
    this.updateIndex = this.updateIndex.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  /** ***********************************************************************************
   *  1. Extract from redux store Vaccine and Treatment Product Masters for Approved Products
   *  2. Add filtered Vaccine and Treatment Product Masters to Component State
   */
  componentDidMount() {
    const { vaccineProducts, treatmentProducts } = this.props;
    this.setState({
      filtVaccineProd: vaccineProducts,
      filtTreatmentProd: treatmentProducts
    });
  }

  // SearchBar
  updateSearch = (searchText) => {
    const searchLowercase = searchText.toLowerCase();
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
  };

  // ButtonGroup selected index is local to this screen, so it should remain in the localstate
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    const buttons = [t('products.buttons.left'), t('products.buttons.right')];
    const { filtVaccineProd, filtTreatmentProd, selectedIndex, searchText } = this.state;
    if (this.props.settings.isOnline) {
      return (
        <>
          <View
            style={{ flex: 1 }}
            contentContainerStyle={gStyle.contentContainer}
          >
            <Searchbar
              placeholder={t('products.searchBar.placeholder')}
              onChangeText={this.updateSearch}
              value={searchText}
              style={{ borderRadius: 0 }}
            />
            <View style={gStyle.spacer8} />
            <ScrollView>
              <ViewCardText title={t('products.card.title')} text={t('products.card.instructionText')} />
              <ViewButtonGroup buttons={buttons} onPress={this.updateIndex} selectedIndex={selectedIndex} />
              <View>
                { (selectedIndex === 0 && filtVaccineProd.length > 0) &&
                  <ViewProductMasters
                    productMasters={filtVaccineProd}
                    navigation={this.props.navigation}
                  />
                }
                { (selectedIndex === 1 && filtTreatmentProd.length > 0) &&
                  <ViewProductMasters
                    productMasters={filtTreatmentProd}
                    navigation={this.props.navigation}
                  />
                }
                { (selectedIndex === 0 && filtVaccineProd.length === 0) &&
                  <ViewCardText text={ t('products.emptyText.left') } />
                }
                { (selectedIndex === 1 && filtTreatmentProd.length === 0) &&
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
  const vaccineProducts = [];
  const treatmentProducts = [];

  selectProducts(state).forEach((prod, i) => {
    const product = productMaster.mapProduct(prod, i, state.settings.language);
    if (product.type === productType.vaccine) {
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
