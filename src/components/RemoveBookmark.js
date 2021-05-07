import * as React from 'react';
//import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { gStyle } from '../constants';
import Icon from './Icon';

// [mrj] placeholder for now, but it will trigger removal of bookmark from storage

const RemoveBookmark = () => (
  <TouchableOpacity
    accessible
    accessibilityLabel="remove bookmark"
    accessibilityComponentType="button"
    accessibilityTraits="button"
    activeOpacity={gStyle.activeOpacity}
    onPress={() => alert('Bookmark removal not yet implemented.')}
    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
  >
    <Icon name='bookmark' solid />
  </TouchableOpacity>
);

RemoveBookmark.propTypes = {
  // required
//  navigation: PropTypes.object.isRequired
};

export default RemoveBookmark;
