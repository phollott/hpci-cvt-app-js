import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, List, Divider } from 'react-native-paper';
import { t } from 'i18n-js';
import Icon from './Icon';
import { colors } from '../constants';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', width: '100%', justifyContent: 'center' }}>
        { this.props.productMasters.map( productMaster =>
          <View key={ 'view-'.concat(productMaster.key) }
            style={ (productMaster.isNew || productMaster.isUpdated) ? { backgroundColor: colors.lightGreen } : {} }
          >
            <Divider/>
            <List.Item key={ productMaster.key }
              left={ () => {
                return <Icon reverse
                  name={ productMaster.type === 'Vaccine' ? 'syringe' : 'pills' }
                  color={ productMaster.showLink ? colors.darkColor : colors.orange }
                  />;
              }}
              title={
                <Text>
                  <Text>
                    {productMaster.brandName.trim()}
                  </Text>
                  <View>
                    { productMaster.isNew && !productMaster.isUpdated && <Badge style={[styles.updateBadge, {backgroundColor: colors.green}]}>{t('common.badge.new')}</Badge> }
                    { productMaster.isUpdated && <Badge style={[styles.updateBadge, {backgroundColor: colors.orange}]}>{t('common.badge.updated')}</Badge> }
                  </View>
                </Text>
              } 
              titleStyle={{fontWeight: 'bold'}}
              titleNumberOfLines={2}
              description={ () =>
                <Text>
                  <Text style={{ color: colors.grey }}>{ productMaster.ingredient }</Text>
                  { '\n' }
                  <Text style={{ fontSize: 12 }}>{ productMaster.companyName }</Text>
                </Text>
              }
              onPress={ () => {
                productMaster.showLink && this.props.navigation.navigate('ProductDetails', { productMaster })
              }}
              right={ () => {
                return productMaster.showLink ? <Icon name='chevron-right' color={colors.darkColor} size={12} style={{ marginTop: 12, marginRight: 8 }} /> : null;
              }}
            />
            <Divider/>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  updateBadge: {
    color: 'white',
    marginLeft: 4,
    marginRight: 4,
    paddingHorizontal: 8
  }
});
