import React, { Component } from 'react';
import { Image } from 'react-native';
import { images } from '../constants';

const internalState = {
  canadaWordmark: 'canadaWordmark'
};

export default class HeaderTitle extends Component {
  constructor(props) {
    super(props);
    this.state = internalState;
  }

  render() {
    const { canadaWordmark } = this.state;
    return (
      <Image
        source={images[canadaWordmark]}
        style={{
          width: 100,
          height: 24
        }}
      />
    );
  }
}
