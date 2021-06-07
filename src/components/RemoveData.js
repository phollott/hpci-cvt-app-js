import { Alert as Confirm } from 'react-native';
import { t } from 'i18n-js';
import { storage } from '../services';

// dev tool

const navStacks = (props) => {
  // [mrj] hack: navigation is used to ensure the bookmarks screen is re-rendered after bookmarks are cleared
  props.navigation.navigate('BookmarksStack', {screen: 'Bookmarks', params: { bookmarkAction: '-clear'}});
  props.navigation.navigate('HomeStack', {screen: 'Home'});
};

const RemoveData = (props) => {
  try {
    Confirm.alert(
      t('home.menu.removeAlert.title'),
      t('home.menu.removeAlert.text'),
      [
        { text: t('common.alert.button.cancel'), onPress: () => {}, style: "cancel" },
        { text: t('common.alert.button.ok'), 
          onPress: async () => {
            // clear settings, bookmarks
            storage.deleteAll().then(navStacks(props));
          }
        }
      ]
    );
  } catch (error) {
    console.log('Unable to clear storage. ', error);
  }
}

export default RemoveData;