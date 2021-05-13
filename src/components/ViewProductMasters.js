import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from './Icon';

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
            onPress={() => 
              productMaster.showLink && this.props.navigation.navigate('ProductDetails', { productMaster })
            }
          >
            <Icon reverse
              name={ productMaster.type === 'Vaccine' ? 'syringe' : 'pills' }
              color={ productMaster.showLink ? '#26374A': '#FF9F40' }
            />
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold' }}>
                { productMaster.brandName }
              </ListItem.Title>
              <ListItem.Subtitle>{ productMaster.ingredient }</ListItem.Subtitle>
              <Text>{ productMaster.companyName } ({ productMaster.status })</Text>
            </ListItem.Content>
            { productMaster.showLink && <ListItem.Chevron color='blue'/> }
          </ListItem>
        )}
      </View>
    );
  }
}
