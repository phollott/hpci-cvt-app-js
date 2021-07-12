import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import PropTypes from 'prop-types';
import { t } from 'i18n-js';
import { colors } from '../constants';

export default class ReadMoreText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={styles.readTextLabel} onPress={handlePress}>
        {t('common.readText.more')}
      </Text>
    );
  };

  renderRevealedFooter = (handlePress) => {
    return (
      <Text style={styles.readTextLabel} onPress={handlePress}>
        {t('common.readText.less')}
      </Text>
    );
  };

  handleTextReady = () => {
    // ...
  };

  render() {
    const { text, numberOfLines } = this.props;

    return (
      <ReadMore
        numberOfLines={numberOfLines}
        renderTruncatedFooter={this.renderTruncatedFooter}
        renderRevealedFooter={this.renderRevealedFooter}
        onReady={this.handleTextReady}
      >
        <Text>{text}</Text>
      </ReadMore>
    );
  }
}

const styles = StyleSheet.create({
  readTextLabel: {
    color: colors.blue,
    marginTop: 5
  }
});

ReadMoreText.defaultProps = {
  numberOfLines: 2
};

ReadMoreText.propTypes = {
  // required
  text: PropTypes.string.isRequired,

  // optional
  numberOfLines: PropTypes.number
};
