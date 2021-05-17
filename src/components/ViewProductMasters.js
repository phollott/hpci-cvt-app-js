import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import { t } from 'i18n-js';
import Icon from './Icon';

import { productMaster } from '../services';

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
              <Text>{ productMaster.companyName } ({ productMaster.status })
                { productMaster.isNew && !productMaster.isUpdated && <Badge value={t('common.badge.new')} status='success' containerStyle={{ marginLeft: 2, marginTop: -3 }} /> }
                { productMaster.isUpdated && <Badge value={t('common.badge.updated')} status='warning' containerStyle={{ marginLeft: 2, marginTop: -3 }} /> }  
              </Text>
            </ListItem.Content>
            { productMaster.showLink && <ListItem.Chevron color='blue'/> }
          </ListItem>
        )}
      </View>
    );
  }
}
