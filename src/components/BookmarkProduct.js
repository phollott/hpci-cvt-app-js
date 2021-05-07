import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import Alert from './Alert';
import Icon from './Icon';
import { selectProductsByID } from '../redux/selectors/productSelector';
import { storage } from '../services';

const BookmarkProduct = ({ navigation, route }) => {
  
  const state = useSelector(state => state);

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel="bookmark product"
      accessibilityComponentType="button"
      accessibilityTraits="button"
      activeOpacity={gStyle.activeOpacity}
      onPress={ async () => {
        var productMaster = route.params.productMaster;
        if (productMaster) {
          try {
            var products = selectProductsByID(state, productMaster.nid);
            if (products.length === 2
              && 'enfr'.includes(products[0].language.toLowerCase().substring(0,2))
              && 'enfr'.includes(products[1].language.toLowerCase().substring(0,2)) )
            {
              var bookmarks = [];
              // key format: bookmark-product-authorized + nid + '-' + lang, ex.: bookmark-product-authorized16-en, bookmark-product-authorized16-fr
              bookmarks.push([ 'bookmark-product-authorized'.concat(productMaster.nid + '-' + products[0].language.toLowerCase().substring(0,2)), JSON.stringify(products[0]) ]);
              bookmarks.push([ 'bookmark-product-authorized'.concat(productMaster.nid + '-' + products[1].language.toLowerCase().substring(0,2)), JSON.stringify(products[1]) ]);
              // save en and fr products to storage
              await storage.saveMulti(bookmarks);
              // [mrj] hack: navigation is used to ensure the bookmarks screen is re-rendered after bookmark is added
              navigation.navigate('BookmarksStack', {
                screen: 'Bookmarks', 
                params: { bookmarkAction: '-add-'.concat(productMaster.nid).concat('-' + (new Date()).getTime().toString()) }
              });
              navigation.navigate('ProductsStack', {screen: 'ProductDetails'});
              Alert( t('common.message.bookmarked', {brandName: productMaster.brandName}) );
              //console.log(await storage.retrieveMulti(['bookmark-product-authorized'+productMaster.nid+'-en', 'bookmark-product-authorized'+productMaster.nid+'-fr']));
            } else {
              throw 'Unable to create bookmark.'
            }
          }
          catch (error) {
            Alert( t('common.message.error.bookmarked') );
            console.log(t('common.message.error.bookmarked'), error);
          }
        }
      }}
      style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 8
      }}
    >
      <Icon name='bookmark' />
    </TouchableOpacity>
  )
};

BookmarkProduct.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default BookmarkProduct;
