import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import Alert from './Alert';
import Icon from './Icon';
import { addBookmark, removeBookmark } from '../redux/actions/bookmarkActions';
import { selectProductsByID } from '../redux/selectors/productSelector';
import { selectBookmarkExists } from '../redux/selectors/bookmarkSelector';
import { storage } from '../services';

const BookmarkProduct = ({ navigation, route }) => {
  
  const state = useSelector(state => state);
  const isBookmark = useSelector(state => {
    return selectBookmarkExists(state, route.params.productMaster.nid);
  });

  const dispatch = useDispatch();
  const addBookmarkProduct = bookmarks => dispatch(addBookmark(bookmarks));
  const removeBookmarkProduct = nid => dispatch(removeBookmark(nid));

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
              if (!isBookmark) {
                // dispatch en and fr products to state store bookmarks
                addBookmarkProduct(products);

                // save en and fr bookmarks to storage
                var bookmarks = [];
                // key format: bookmark-product + nid + '-' + lang, ex.: bookmark-product16-en, bookmark-product16-fr
                bookmarks.push([ 'bookmark-product'.concat(productMaster.nid + '-' + products[0].language.toLowerCase().substring(0,2)), JSON.stringify(products[0]) ]);
                bookmarks.push([ 'bookmark-product'.concat(productMaster.nid + '-' + products[1].language.toLowerCase().substring(0,2)), JSON.stringify(products[1]) ]);
                await storage.saveMulti(bookmarks);

              } else {
                // dispatch removal of en and fr products from state store bookmarks
                removeBookmarkProduct(products[0].nid);

                // remove en and fr bookmarks from storage
                await storage.deleteMulti(['bookmark-product'+productMaster.nid+'-en', 'bookmark-product'+productMaster.nid+'-fr']);
              }
              //console.log(await storage.retrieveMulti(['bookmark-product'+productMaster.nid+'-en', 'bookmark-product'+productMaster.nid+'-fr']));

              // [mrj] hack: navigation is used to ensure the bookmarks screen is re-rendered after bookmark is added or removed
              navigation.navigate('BookmarksStack', {
                screen: 'Bookmarks', 
                params: { bookmarkAction: (isBookmark ? '-remove' : '-add-'.concat(productMaster.nid)).concat('-' + (new Date()).getTime().toString()) }
              });
              navigation.navigate('ProductsStack', {screen: 'ProductDetails'});
            } else {
              throw isBookmark ? 'Unable to remove bookmark.' : 'Unable to create bookmark.'; 
            }
          }
          catch (error) {
            if (isBookmark) {
              Alert( t('common.message.error.bookmark.remove') );
            } else {
              Alert( t('common.message.error.bookmark.add') );
            }
            console.log(error);
          }
        }
      }}
      style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 8
      }}
    >
      <Icon name='bookmark' solid={isBookmark} />
    </TouchableOpacity>
  )
};

BookmarkProduct.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default BookmarkProduct;
