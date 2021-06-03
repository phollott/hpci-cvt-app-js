import React, { Component } from 'react';
import { Image } from 'react-native';
import { images } from '../constants';

const internalState = {
  canadaLogo: 'canadaLogo'
};

export default class HeaderTitle extends Component {
  constructor(props) {
    super(props);
    this.state = internalState;
  }

  render() {
    return ( 
      <Image
        source={ images[this.state.canadaLogo] }
        style={{ 
          width: 103, 
          height: 32 
        }}
      />
    );
  }
}
