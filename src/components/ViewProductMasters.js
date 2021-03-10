import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /* [pmh] the width gets passed down to force the width of the card, which should not be necessary. 
   * Withhold the link if there is no corresponding Product Detail.
   */
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {this.props.productMasters.map( productMaster =>
          <ListItem key={productMaster.key} bottomDivider
            containerStyle={{width: this.props.width}}
            onPress={() => (productMaster.link) 
              && this.props.navigation.navigate('ProductDetails', { productMaster })}
          >
            <Icon type='font-awesome-5' reverse={true} size={20} 
              color={ (productMaster.link !== null) ? 'blue': 'orange' }
              name={ (productMaster.type === 'Vaccine' || productMaster.type === 'Vaccin') ? 'syringe' : 'pills' } 
            />
            <ListItem.Content>
              <ListItem.Title>{productMaster.brandName}</ListItem.Title>
              <ListItem.Subtitle>{productMaster.companyName} ({productMaster.status})</ListItem.Subtitle>
            </ListItem.Content>
            { (productMaster.link) &&
              <ListItem.Chevron/>
            }
          </ListItem>
        )}
      </View>
    );
  }

}