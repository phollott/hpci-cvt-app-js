import React, { Component } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { colors, gStyle } from '../constants';
import { bookmarkKeyPrefix, productType } from '../constants/constants';
import { addBookmark } from '../redux/actions/bookmarkActions';
import { addProduct } from '../redux/actions/productActions';
import { selectBookmarks } from '../redux/selectors/bookmarkSelector';
import { productMaster, productLoad, bookmarkStorage } from '../services';
import { wait } from '../shared/util';

// components
import ViewButtonGroup from './ViewButtonGroup';
import ViewCardText from './ViewCardText';
import ViewProductMasters from './ViewProductMasters';

export const bookmarksScrollViewRef = React.createRef();

const internalState = {
  filtVaccineProd: [],
  filtTreatmentProd: [],
  refreshing: false,
  selectedIndex: 0
};

class ViewBookmarkedProducts extends Component {
  constructor(props) {
    super(props);
    this.state = internalState;
    this.onRefresh = this.onRefresh.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

  /** ***********************************************************************************
   *  1. Extract from redux store bookmarked Vaccine and Treatment Product Masters for Approved Products
   *  2. Add filtered Vaccine and Treatment Product Masters to Component State
   */
  componentDidMount() {
    const { vaccineProducts, treatmentProducts } = this.props;
    this.setState({
      filtVaccineProd: vaccineProducts,
      filtTreatmentProd: treatmentProducts,
      selectedIndex:
        vaccineProducts.length === 0 && treatmentProducts.length > 0 ? 1 : 0
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
    const { dispatch, settings } = this.props;
    if (settings.isOnline) {
      // fetch, retrieve, (scrape, store)
      const fetchedProducts = await productLoad.fetchProducts();
      if (fetchedProducts.length > 1) {
        const retrievedBookmarks = await bookmarkStorage.retrieveBookmarks(
          fetchedProducts
        );
        const nids = [
          ...new Set(fetchedProducts.map((product) => product.nid))
        ];
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
    }
  };

  // ButtonGroup selected index is local to this screen, so it should remain in the localstate
  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    const buttons = [
      t('bookmarks.products.buttons.left'),
      t('bookmarks.products.buttons.right')
    ];
    const { vaccineProducts, treatmentProducts, navigation } = this.props;
    const {
      filtVaccineProd,
      filtTreatmentProd,
      refreshing,
      selectedIndex
    } = this.state;
    if (vaccineProducts.length > 0 || treatmentProducts.length > 0) {
      return (
        <View
          style={{ flex: 1 }}
          contentContainerStyle={gStyle.contentContainer}
        >
          <View style={gStyle.spacer8} />
          <ScrollView
            ref={bookmarksScrollViewRef}
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
              title={t('bookmarks.products.card.title')}
              text={t('bookmarks.products.card.instructionText')}
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
                <ViewCardText text={t('bookmarks.products.emptyText.left')} />
              )}
              {selectedIndex === 1 && filtTreatmentProd.length === 0 && (
                <ViewCardText text={t('bookmarks.products.emptyText.right')} />
              )}
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <>
          <View style={gStyle.spacer8} />
          <ViewCardText text={t('bookmarks.introText')} />
        </>
      );
    };
  }
}

const mapStateToProps = (state) => {
  const vaccineProducts = [];
  const treatmentProducts = [];

  // Bookmarks:  (bookmark.key to match storage's)
  selectBookmarks(state).forEach((bookmark) => {
    const product = productMaster.mapProduct(
      bookmark,
      bookmarkKeyPrefix.concat(
        bookmark.nid.concat('-').concat(state.settings.language)
      ),
      state.settings.language,
      true
    );
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
    ),
    selectedIndex:
      vaccineProducts.length === 0 && treatmentProducts.length > 0 ? 1 : 0
  };
};

export default connect(mapStateToProps)(ViewBookmarkedProducts);
