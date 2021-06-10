import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Badge } from 'react-native-elements';
import { List, Divider } from 'react-native-paper';
import { t } from 'i18n-js';
import Icon from './Icon';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'center' }}>
        { this.props.productMasters.map( productMaster =>
          <View key={ 'view-'.concat(productMaster.key) }
            style={ (productMaster.isNew || productMaster.isUpdated) ? { backgroundColor: '#C1D699' } : {  } }
          >
            <Divider/>
            <List.Item key={ productMaster.key }
              left={ () => {
                return <Icon reverse
                  name={ productMaster.type === 'Vaccine' ? 'syringe' : 'pills' }
                  color={ productMaster.showLink ? '#26374A': '#FF9F40' }
                  />;
              }}
              title={
                <Text>
                  { productMaster.brandName }
                  { productMaster.isNew && !productMaster.isUpdated && <Badge value={t('common.badge.new')} status='success' /> }
                  { productMaster.isUpdated && <Badge value={t('common.badge.updated')} status='warning' /> } 
                </Text>
              } 
              titleStyle={ { fontWeight: 'bold' } }
              titleNumberOfLines={2}
              description={ () =>
                <Text>
                  <Text style={{ color: 'grey' }}>{ productMaster.ingredient }</Text>
                  { '\n' }
                  <Text style={{ fontSize: 12 }}>{ productMaster.companyName }</Text>
                </Text>
              }
              onPress={ () => {
                productMaster.showLink && this.props.navigation.navigate('ProductDetails', { productMaster })
              }}
              right={ () => {
                return productMaster.showLink ? <Icon name='chevron-right' color='blue' size={12} style={{ marginTop: 12, marginRight: 8 }} /> : null;
              }}
            />
            <Divider/>
          </View>
        )}
      </View>
    );
  }
}
