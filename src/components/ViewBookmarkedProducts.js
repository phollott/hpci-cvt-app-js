import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ButtonGroup, Card, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import { selectBookmarks } from '../redux/selectors/bookmarkSelector';
import { productMaster } from '../services';

// components
import ViewProductMasters from './ViewProductMasters';

const internalState = {
  searchText: '',
  selectedIndex: 0,
  filtAuthProd: []
};

class ViewBookmarkedProducts extends Component {
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
   * 1. Extract from redux store bookmarked Vaccine and Treatment Product Masters for Approved Products
   * 2. Add filtered Approved Product Masters to Component State
   */
  componentDidMount() {
    this.setState({
      filtAuthProd: this.props.authorizedProducts
    });
  }

  render() {
    const buttons = [ t('bookmarks.products.buttons.authorized') ];
    const { selectedIndex } = this.state;
    const { searchText } = this.state;
    if (this.props.authorizedProducts.length > 0) {
      return (
        <View 
          style={{ flex: 1 }}
          contentContainerStyle={gStyle.contentContainer}
        >
          { 1 === 0 &&
          <SearchBar
            placeholder={ t('bookmarks.products.searchBar.placeholder') }
            onChangeText={ this.updateSearch }
            value={ searchText }
          />
          }
          <View style={gStyle.spacer8} />
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
  var authorizedProducts = [];

  // Bookmarks:  (bookmark.key to match storage's)
  selectBookmarks(state).forEach((bookmark) => {
    authorizedProducts.push(productMaster.mapAuthorizedProduct(bookmark, 'bookmark-product'.concat(bookmark.nid + '-' + state.settings.language)));
  });

  return {
    authorizedProducts: authorizedProducts.sort((a, b) => (a.brandName > b.brandName) ? 1 : -1),
    settings: state.settings
  };
};

export default connect(mapStateToProps)(ViewBookmarkedProducts);
