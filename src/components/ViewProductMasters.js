import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <View style={{ width: '100%', justifyContent: 'center' }}>
        { this.props.productMasters.map( productMaster =>
          <ListItem key={ productMaster.key } bottomDivider topDivider
            onPress={() => (productMaster.link) && 
              this.props.navigation.navigate('ProductDetails', { productMaster })}
          >
            <Icon type='font-awesome-5' reverse size={20} 
              color={ (productMaster.link !== null) ? '#26374A': '#FF9F40' }
              name={ (productMaster.type === 'Vaccine' || productMaster.type === 'Vaccin') ? 'syringe' : 'pills' } 
            />
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold' }}>
                { productMaster.brandName }
              </ListItem.Title>
              <ListItem.Subtitle>{ productMaster.ingredient }</ListItem.Subtitle>
              <Text>{ productMaster.companyName } ({ productMaster.status })</Text>
            </ListItem.Content>
            { (productMaster.link) && <ListItem.Chevron color='blue'/> }
          </ListItem>
        )}
      </View>
    );
  }

}