import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { gStyle } from '../constants';

export default class ViewCardText extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <View contentContainerStyle={gStyle.contentContainer} style={ styles.container}>
        <Card>
          { 
            this.props.title && 
            <Card.Title style={ styles.cardTitle }>{this.props.title}</Card.Title>
          }
          {
            this.props.text &&
            <Text>{ this.props.text }</Text>
          }
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  cardTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15
  }
});
