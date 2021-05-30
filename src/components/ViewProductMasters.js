import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import { t } from 'i18n-js';
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
            containerStyle={ (productMaster.isNew || productMaster.isUpdated) ? { backgroundColor: '#C1D699' } : { } }
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
                { productMaster.isNew && !productMaster.isUpdated && <Badge value={t('common.badge.new')} status='success' /> }
                { productMaster.isUpdated && <Badge value={t('common.badge.updated')} status='warning' /> }  
              </ListItem.Title>
              <ListItem.Subtitle>{ productMaster.ingredient }</ListItem.Subtitle>
              <Text style={{ fontSize: 12 }}>{ productMaster.companyName }</Text>
              { // TODO remove this if it's not required here 
                // <Text style={{ fontSize: 12 }}>({ productMaster.status })</Text>
              }
            </ListItem.Content>
            { productMaster.showLink && <ListItem.Chevron color='blue'/> }
          </ListItem>
        )}
      </View>
    );
  }
}
