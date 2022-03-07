/* eslint-disable no-console */
import ProductLoadService from './ProductLoadService';
import StorageService from './StorageService';
import { bookmarkKeyPrefix } from '../constants/constants';
import { isNil } from '../shared/util';

const keyBookmark = async (bookmark) => {
  return bookmarkKeyPrefix.concat(
    bookmark.nid
      .concat('-')
      .concat(bookmark.language.toLowerCase().substring(0, 2))
  );
};

const saveBookmark = async (bookmark) => {
  try {
    const key = await keyBookmark(bookmark);
    await StorageService.save(key, JSON.stringify(bookmark));
  } catch (error) {
    console.log('Unable to sync bookmark with product. ', error);
  }
};

const deleteBookmark = async (bookmark) => {
  try {
    const key = await keyBookmark(bookmark);
    await StorageService.delete(key);
  } catch (error) {
    console.log('Unable to sync bookmark with product. ', error);
  }
};

const saveProductBookmarks = async (products) => {
  // save en and fr products to bookmarks
  const bookmarks = [];
  bookmarks.push([
    await keyBookmark({
      nid: products[0].nid,
      language: products[0].language.toLowerCase().substring(0, 2)
    }),
    JSON.stringify(products[0])
  ]);
  bookmarks.push([
    await keyBookmark({
      nid: products[1].nid,
      language: products[1].language.toLowerCase().substring(0, 2)
    }),
    JSON.stringify(products[1])
  ]);
  await StorageService.saveMulti(bookmarks);
};

const deleteProductBookmarks = async (id) => {
  await StorageService.deleteMulti([
    await keyBookmark({ nid: id, language: 'en' }),
    await keyBookmark({ nid: id, language: 'fr' })
  ]);
};

const retrieveBookmarks = async (syncWithProducts = null) => {
  let keys = [];
  let storedBookmarks = [];
  const bookmarks = [];
  try {
    keys = await StorageService.retrieveKeys();
    if (keys.length > 0) {
      keys = keys.filter((key) => {
        return key.startsWith(bookmarkKeyPrefix);
      });
      storedBookmarks =
        keys !== null ? await StorageService.retrieveMulti(keys) : [];
      storedBookmarks.forEach((storedBookmark) => {
        const bookmark = JSON.parse(storedBookmark[1]);
        if (!isNil(syncWithProducts) && syncWithProducts.length > 0) {
          const product = syncWithProducts.filter((p) => {
            return p.language === bookmark.language && p.nid === bookmark.nid;
          });
          if (product.length === 1) {
            bookmarks.push(product[0]);
            // set consumer info async
            ProductLoadService.setConsumerInformation(product[0]).then(
              (productInfoToSyncWith) => {
                // update storage async
                saveBookmark(productInfoToSyncWith);
              }
            );
          } else {
            // update storage async
            deleteBookmark(product[0]);
          }
        } else {
          bookmarks.push(bookmark);
        }
      });
    }
  } catch (error) {
    console.log('Unable to get bookmarks from storage. ', error);
  }
  return bookmarks;
};

export default {
  keyBookmark,
  deleteBookmark,
  saveBookmark,
  saveProductBookmarks,
  deleteProductBookmarks,
  retrieveBookmarks
};
