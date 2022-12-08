import React, { Component } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';
import { productType } from '../constants/constants';
import { addBookmark } from '../redux/actions/bookmarkActions';
import { addProduct } from '../redux/actions/productActions';
import { selectProducts } from '../redux/selectors/productSelector';
import { productMaster, productLoad, bookmarkStorage } from '../services';
import { wait } from '../shared/util';

// components
import ViewButtonGroup from './ViewButtonGroup';
import ViewCardText from './ViewCardText';
import ViewProductMasters from './ViewProductMasters';

export const productsScrollViewRef = React.createRef();

const internalState = {
  filtVaccineProd: [],
  filtTreatmentProd: [],
  refreshing: false,
  selectedIndex: 0,
  searchVaccineText: '',
  searchTreatmentText: ''
};

class ViewCovid19Products extends Component {
  constructor(props) {
    super(props);
    this.state = internalState;
    this.onRefresh = this.onRefresh.bind(this);
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

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.sync();
    wait(1000).then(() => {
      this.setState({ refreshing: false });
    });
  };

  sync = async () => {
    const { dispatch } = this.props;
    // fetch, retrieve, (scrape, store)
    const fetchedProducts = await productLoad.fetchProducts();
    if (fetchedProducts.length > 1) {
      const retrievedBookmarks = await bookmarkStorage.retrieveBookmarks(
        fetchedProducts
      );
      const nids = [...new Set(fetchedProducts.map((product) => product.nid))];
      nids.forEach((nid) => {
        const enfrProduct = fetchedProducts.filter((product) => {
          return nid === product.nid;
        });
        const enfrBookmark = retrievedBookmarks.filter((bookmark) => {
          return nid === bookmark.nid;
        });
        // and dispatch
        if (enfrProduct.length === 2) {
          dispatch(addProduct(enfrProduct));
        }
        if (enfrBookmark.length === 2) {
          dispatch(addBookmark(enfrBookmark));
        }
      });
    }
  };

  // SearchBar
  updateSearch = (searchText) => {
    const { vaccineProducts, treatmentProducts } = this.props;
    const { selectedIndex, searchVaccineText, searchTreatmentText } =
      this.state;
    let searchVaccine = '';
    let searchTreatment = '';
    if (selectedIndex === 0) {
      searchVaccine = searchText;
      searchTreatment = searchTreatmentText;
    } else if (selectedIndex === 1) {
      searchVaccine = searchVaccineText;
      searchTreatment = searchText;
    }
    const filteredVaccineProducts = vaccineProducts.filter((item) => {
      const itemData = item.searchKey;
      return itemData.indexOf(searchVaccine.toLowerCase()) > -1;
    });
    const filteredTreatmentProducts = treatmentProducts.filter((item) => {
      const itemData = item.searchKey;
      return itemData.indexOf(searchTreatment.toLowerCase()) > -1;
    });
    this.setState({
      filtVaccineProd: filteredVaccineProducts,
      filtTreatmentProd: filteredTreatmentProducts,
      searchVaccineText: searchVaccine,
      searchTreatmentText: searchTreatment
    });
  };

  // ButtonGroup selected index is local to this screen, so it should remain in the localstate
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    const buttons = [t('products.buttons.left'), t('products.buttons.right')];
    const { settings, navigation } = this.props;
    const {
      filtVaccineProd,
      filtTreatmentProd,
      refreshing,
      selectedIndex,
      searchVaccineText,
      searchTreatmentText
    } = this.state;
    if (settings.isOnline) {
      return (
        <>
          <View
            style={{ flex: 1 }}
            contentContainerStyle={gStyle.contentContainer}
          >
            {selectedIndex === 0 && (
              <Searchbar
                placeholder={t('products.searchBar.placeholder.vaccines')}
                onChangeText={this.updateSearch}
                value={searchVaccineText}
                inputStyle={{ fontSize: 16 }}
                style={{ borderRadius: 0 }}
              />
            )}
            {selectedIndex === 1 && (
              <Searchbar
                placeholder={t('products.searchBar.placeholder.treatments')}
                onChangeText={this.updateSearch}
                value={searchTreatmentText}
                inputStyle={{ fontSize: 16 }}
                style={{ borderRadius: 0 }}
              />
            )}
            <View style={gStyle.spacer8} />
            <ScrollView
              ref={productsScrollViewRef}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                  colors={[colors.darkColor]}
                  tintColor={colors.darkColor}
                />
              }
            >
              <ViewCardText
                title={t('products.card.title')}
                text={t('products.card.instructionText')}
              />
              <ViewButtonGroup
                buttons={buttons}
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
              />
              <View>
                {selectedIndex === 0 && filtVaccineProd.length > 0 && (
                  <ViewProductMasters
                    productMasters={filtVaccineProd}
                    navigation={navigation}
                  />
                )}
                {selectedIndex === 1 && filtTreatmentProd.length > 0 && (
                  <ViewProductMasters
                    productMasters={filtTreatmentProd}
                    navigation={navigation}
                  />
                )}
                {selectedIndex === 0 && filtVaccineProd.length === 0 && (
                  <ViewCardText text={t('products.emptyText.left')} />
                )}
                {selectedIndex === 1 && filtTreatmentProd.length === 0 && (
                  <ViewCardText text={t('products.emptyText.right')} />
                )}
              </View>
            </ScrollView>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={gStyle.spacer8} />
          <ViewCardText text={t('products.card.offlineText')} />
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
    vaccineProducts: vaccineProducts.sort((a, b) =>
      a.brandName > b.brandName ? 1 : -1
    ),
    treatmentProducts: treatmentProducts.sort((a, b) =>
      a.brandName > b.brandName ? 1 : -1
    )
  };
};

export default connect(mapStateToProps)(ViewCovid19Products);
