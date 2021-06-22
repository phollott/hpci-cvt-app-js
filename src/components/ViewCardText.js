import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { colors, gStyle } from '../constants';

export default class ViewCardText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { text, title } = this.props;
    return (
      <View
        contentContainerStyle={gStyle.contentContainer}
        style={styles.container}
      >
        <Card style={styles.cardContainer}>
          {title && (
            <Card.Content style={styles.cardContentTitle}>
              <Text style={styles.cardContentTitleText}>{title}</Text>
            </Card.Content>
          )}
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardContentText}>{text}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center'
  },
  cardContainer: {
    borderRadius: 0,
    marginHorizontal: 0,
    marginTop: 0
  },
  cardContentTitle: {
    alignItems: 'center'
  },
  cardContentTitleText: {
    color: colors.darkColor,
    fontSize: 18,
    fontWeight: 'bold'
  },
  cardContent: {
    marginTop: 12
  },
  cardContentText: {
    color: colors.darkColor
  }
});

ViewCardText.defaultProps = {
  text: '',
  title: null
};

ViewCardText.propTypes = {
  // optional
  text: PropTypes.string,
  title: PropTypes.string
};
