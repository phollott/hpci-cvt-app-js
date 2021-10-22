import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18n-js';
import { gStyle } from '../constants';
import Alert from './Alert';
import Icon from './Icon';
import { removeBookmark } from '../redux/actions/bookmarkActions';
import {
  selectBookmarkExists,
  selectBookmarksByID
} from '../redux/selectors/bookmarkSelector';
import { storage } from '../services';
import { getTimeInMillis } from '../shared/date-fns';

const BookmarkTouch = ({ navigation, route }) => {
  const state = useSelector((state) => state);
  const isBookmark = useSelector((state) => {
    return selectBookmarkExists(state, route.params.productMaster.nid);
  });

  const dispatch = useDispatch();
  const removeBookmarkProduct = (nid) => dispatch(removeBookmark(nid));

  const navStacks = () => {
    // [mrj] hack: navigation is used to ensure screens are re-rendered after bookmark is removed
    navigation.navigate('ProductsStack', { screen: 'Products' });
    navigation.navigate('BookmarksStack', {
      screen: 'Bookmarks',
      params: {
        bookmarkAction: '-remove-'.concat(getTimeInMillis().toString())
      }
    });
  };

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel="bookmark product"
      accessibilityComponentType="button"
      accessibilityTraits="button"
      activeOpacity={gStyle.activeOpacity}
      onPress={async () => {
        const productMaster = route.params.productMaster;
        if (productMaster) {
          try {
            const products = selectBookmarksByID(state, productMaster.nid);
            if (
              products.length === 2 &&
              'enfr'.includes(products[0].language.toLowerCase().substring(0, 2)) &&
              'enfr'.includes(products[1].language.toLowerCase().substring(0, 2))
            ) {
              if (isBookmark) {
                // dispatch removal of en and fr products from state store bookmarks
                removeBookmarkProduct(products[0].nid);

                // remove en and fr bookmarks from storage
                storage
                  .deleteMulti(['bookmark-product' + productMaster.nid + '-en', 'bookmark-product' + productMaster.nid + '-fr'])
                  .then(navStacks());
              }
              // console.log(await storage.retrieveMulti(['bookmark-product'+productMaster.nid+'-en', 'bookmark-product'+productMaster.nid+'-fr']));
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

BookmarkTouch.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

export default BookmarkTouch;
