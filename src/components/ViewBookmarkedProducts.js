import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ButtonGroup, Card, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import { productMaster } from '../services';
import { storage } from '../services';

// components
import ViewProductMasters from './ViewProductMasters';

const internalState = {
  searchText: '',
  selectedIndex: 0,
  filtAuthProd: [],
  authorizedProducts: []
};

class ViewBookmarkedProducts extends Component {
  constructor(props) {
    super(props);
    this.state = internalState;
    this.updateIndex = this.updateIndex.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.setAuthorizedProducts = this.setAuthorizedProducts.bind(this);
  }

  // bookmarked authorized products
  setAuthorizedProducts = async () => {
    let keys = [], storedBookmarks = [], bookmarkedProducts = [];
    try {
      keys = await storage.retrieveKeys();
      if (keys.length > 0) {
        keys = keys.filter((key) => {
          return key.startsWith('bookmark-product-authorized') && key.endsWith('-'.concat(this.props.settings.language));
        });
        storedBookmarks = keys !== null ? await storage.retrieveMulti(keys) : [];
        storedBookmarks.map( (bookmark) => {
          bookmarkedProducts.push(productMaster.mapAuthorizedProduct(JSON.parse(bookmark[1]), bookmark[0]));
        });
      }
    } catch (error) {
      console.log('Unable to get bookmarked products from storage. ', error);
    }
    this.setState({
      authorizedProducts: bookmarkedProducts,
      filtAuthProd: bookmarkedProducts
    });
  }

  // SearchBar
  updateSearch = (searchText) => {
    var searchLowercase = searchText.toLowerCase();
    const filteredAuthProducts = this.state.authorizedProducts.filter((item) => {
      const itemData = item.searchKey
      return itemData.indexOf(searchLowercase) > -1
    });
    this.setState({ 
      filtAuthProd: filteredAuthProducts,
      searchText: searchText
     });
  }

  // ButtonGroup selected index is local to this screen, so it should remain in the localstate
  updateIndex (selectedIndex) {
    this.setState({ selectedIndex });
  }

  /*************************************************************************************
   * 1. Extract from storage bookmarked Vaccine and Treatment Product Masters for Approved Products
   * 2. Add filtered Approved Product Masters to Component State
   */
  componentDidMount() {
    this.setAuthorizedProducts();
  }

  render() {
    const buttons = [ t('bookmarks.products.buttons.authorized') ];
    const { selectedIndex } = this.state;
    const { searchText } = this.state;
    if (this.state.authorizedProducts.length > 0) {
      return (
        <View 
          style={{ flex: 1 }}
          contentContainerStyle={gStyle.contentContainer}
        >
          <SearchBar
            placeholder={ t('bookmarks.products.searchBar.placeholder') }
            onChangeText={ this.updateSearch }
            value={ searchText }
          />
          <ScrollView>
            <Card>
              <Text>{ t('bookmarks.products.card.instructionText') }</Text>
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
              <Text style={{fontSize: 16}}>{ t('bookmarks.introText') }</Text>
            </Card>
          </View>
        </View>
      );
    };
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

export default connect(mapStateToProps)(ViewBookmarkedProducts);
