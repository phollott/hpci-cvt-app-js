import * as React from 'react';
import { Text } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import { t } from 'i18n-js';
import { colors } from '../constants';

export default class ReadMoreText extends React.Component {
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: colors.blue, marginTop: 5 }} onPress={handlePress}>
        {t('common.readText.more')}
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: colors.blue, marginTop: 5 }} onPress={handlePress}>
        {t('common.readText.less')}
      </Text>
    );
  };

  _handleTextReady = () => {
    // ...
  };

  render() {
    let { text, numberOfLines } = this.props;

    return (
      <ReadMore
        numberOfLines={numberOfLines}
        renderTruncatedFooter={this._renderTruncatedFooter}
        renderRevealedFooter={this._renderRevealedFooter}
        onReady={this._handleTextReady}
      >
        <Text>{text}</Text>
      </ReadMore>
    );
  }
}
