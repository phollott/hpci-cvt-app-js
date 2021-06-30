import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, List, Divider } from 'react-native-paper';
import Icon from './Icon';
import { colors } from '../constants';
// services
import { notifications } from '../services';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productNidsWithUnreadNotification: []
    };
  }

  componentDidMount() {
    notifications.findProductNidsWithUnreadNotification().then((nids) => {
      this.setState({
        productNidsWithUnreadNotification: nids
      });
      // console.log('productNidsWithUnreadNotification', this.state.productNidsWithUnreadNotification);
    });
  }

  render() {
    const { productNidsWithUnreadNotification } = this.state;
    return (
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        {this.props.productMasters.map((productMaster) => (
          <View key={'view-'.concat(productMaster.key)} style={ (productMaster.isNew || productMaster.isUpdated) ? { backgroundColor: colors.lightGreen } : {} }>
            <Divider />
            <List.Item key={productMaster.key}
              left={() => {
                return (
                  <>
                    <Icon
                      reverse
                      name={ productMaster.type === 'Vaccine' ? 'syringe' : 'pills' }
                      color={ productMaster.showLink ? colors.darkColor : colors.orange }
                    />
                    {(productMaster.isNew ||
                      productMaster.isUpdated ||
                      productNidsWithUnreadNotification.includes(
                        parseInt(productMaster.nid, 10)
                      )) && (
                      <Badge
                        size={16}
                        style={[
                          styles.notificationBadge,
                          { backgroundColor: colors.green }
                        ]}
                      />
                    )}
                  </>
                );
              }}
              title={<Text>{productMaster.brandName.trim()}</Text>}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              description={() => (
                <Text>
                  <Text style={{ color: colors.grey }}>
                    {productMaster.ingredient}
                  </Text>
                  {'\n'}
                  <Text style={{ fontSize: 12 }}>
                    {productMaster.companyName}
                  </Text>
                </Text>
              )}
              onPress={() => {
                productMaster.showLink && this.props.navigation.navigate('ProductDetails', {productMaster})
              }}
              right={() => {
                return productMaster.showLink
                  ? <Icon name='chevron-right' color={colors.darkColor} size={12} containerStyle={{ justifyContent: 'flex-start', marginTop: 12, marginRight: 14 }} />
                  : null;
              }}
            />
            <Divider />
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notificationBadge: {
    position: 'absolute',
    top: 2,
    left: 36
  }
});
