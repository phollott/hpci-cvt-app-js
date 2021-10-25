import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import Alert from './Alert';
import Icon from './Icon';
import { addBookmark, removeBookmark } from '../redux/actions/bookmarkActions';
import { selectProductsByID } from '../redux/selectors/productSelector';
import { selectBookmarkExists } from '../redux/selectors/bookmarkSelector';
import { bookmarkStorage, productLoad } from '../services';
import { getTimeInMillis } from '../shared/date-fns';

const BookmarkProduct = ({ navigation, route }) => {
  const state = useSelector((state) => state);
  const isBookmark = useSelector((state) => {
    return selectBookmarkExists(state, route.params.productMaster.nid);
  });

  const dispatch = useDispatch();
  const addBookmarkProduct = (bookmarks) => dispatch(addBookmark(bookmarks));
  const removeBookmarkProduct = (nid) => dispatch(removeBookmark(nid));

  const navStacks = (nid) => {
    // [mrj] hack: navigation is used to ensure the bookmarks screen is re-rendered after bookmark is added or removed
    navigation.navigate('BookmarksStack', {
      screen: 'Bookmarks',
      params: {
        bookmarkAction: (isBookmark ? '-remove' : '-add-'.concat(nid)).concat(
          '-'.concat(getTimeInMillis().toString())
        )
      }
    });
    navigation.navigate('ProductsStack', { screen: 'ProductDetails' });
  };

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel="bookmark product"
      accessibilityComponentType="button"
      accessibilityTraits="button"
      activeOpacity={gStyle.activeOpacity}
      onPress={async () => {
        const { productMaster } = route.params;
        if (productMaster) {
          try {
            const products = selectProductsByID(state, productMaster.nid);
            if (
              products.length === 2 &&
              'enfr'.includes(
                products[0].language.toLowerCase().substring(0, 2)
              ) &&
              'enfr'.includes(
                products[1].language.toLowerCase().substring(0, 2)
              )
            ) {
              if (!isBookmark) {
                productLoad
                  .setConsumerInformation(products[0])
                  .then((productInfoA) => {
                    products[0] = productInfoA;
                    productLoad
                      .setConsumerInformation(products[1])
                      .then((productInfoB) => {
                        products[1] = productInfoB;
                        // dispatch en and fr products to state store bookmarks
                        addBookmarkProduct(products);
                        // save en and fr bookmarks to storage
                        bookmarkStorage
                          .saveProductBookmarks(products)
                          .then(navStacks(productMaster.nid));
                      });
                  });
              } else {
                // dispatch removal of en and fr products from state store bookmarks
                removeBookmarkProduct(products[0].nid);
                // remove en and fr bookmarks from storage
                bookmarkStorage
                  .deleteProductBookmarks(productMaster.nid)
                  .then(navStacks(productMaster.nid));
              }
            } else {
              throw isBookmark ? 'Unable to remove bookmark.' : 'Unable to create bookmark.';
            }
          } catch (error) {
            if (isBookmark) {
              Alert(t('common.message.error.bookmark.remove'));
            } else {
              Alert(t('common.message.error.bookmark.add'));
            }
            // eslint-disable-next-line no-console
            console.log(error);
          }
        }
      }}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8
      }}
    >
      <Icon name="bookmark" solid={isBookmark} />
    </TouchableOpacity>
  );
};

BookmarkProduct.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default BookmarkProduct;
