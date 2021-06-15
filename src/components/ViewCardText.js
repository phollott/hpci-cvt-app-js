import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { colors, gStyle } from '../constants';

export default class ViewCardText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        contentContainerStyle={gStyle.contentContainer}
        style={styles.container}
      >
        <Card style={styles.cardContainer}>
          {
            this.props.title && 
            <Card.Content style={styles.cardContentTitle}>
              <Text style={styles.cardContentTitleText}>{this.props.title}</Text>
            </Card.Content>
          }
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardContentText}>{this.props.text}</Text>
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
