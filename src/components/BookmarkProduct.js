import * as React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { gStyle } from '../constants';

// [pmh] This is just a plaeholder for now, but it will need to trigger bookmarking and
// unbookmarking in the redux store and local storage at some point in the future

const BookmarkProduct = ({ navigation }) => (
  <TouchableOpacity
    accessible
    accessibilityLabel="bookmark product"
    accessibilityComponentType="button"
    accessibilityTraits="button"
    activeOpacity={gStyle.activeOpacity}
    onPress={() => alert('I do nothing, but one day I will change color and bookmark things!')}
    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
  >
    <Icon type='font-awesome-5' size={20} 
      color={ (true === true) ? 'blue': 'green' }
      name={ 'bookmark' } 
    />
  </TouchableOpacity>
);

BookmarkProduct.propTypes = {
  // required
//  navigation: PropTypes.object.isRequired
};

export default BookmarkProduct;
