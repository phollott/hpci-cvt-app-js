import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, List, Divider } from 'react-native-paper';
import Icon from './Icon';
import { colors } from '../constants';
import { productPropsStorage } from '../services';
import { getTimeInMillis, getUTCDate } from '../shared/date-fns';
import { isNil } from '../shared/util';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productLastViewed: getTimeInMillis(),
      productsProps: []
    };
    this.handleProductOnPress = this.handleProductOnPress.bind(this);
    this.isNewlyModifiedNotViewed = this.isNewlyModifiedNotViewed.bind(this);
  }

  componentDidMount() {
    productPropsStorage.retrieveAllProductsProps().then((productsProps) => {
      this.setState({
        productsProps
      });
    });
  }

  handleProductOnPress = async (productMaster) => {
    const { navigation } = this.props;
    const { productsProps } = this.state;
    const showNewlyModified = this.isNewlyModifiedNotViewed(productMaster);
    const allProductProps = productsProps.filter((inProps) => {
      return inProps.id !== productMaster.nid;
    });
    const productProps = await productPropsStorage.setViewed(productMaster.nid);
    this.setState({
      productLastViewed: productProps.viewed,
      productsProps: [...allProductProps, productProps]
    });
    navigation.navigate('ProductDetails', { productMaster, showNewlyModified });
  };

  isNewlyModifiedNotViewed = (productMaster) => {
    const { productsProps } = this.state;
    const productProps = productsProps.filter((inProps) => {
      return inProps.id === productMaster.nid;
    });
    return (
      (productMaster.isNew || productMaster.isUpdated) &&
      (isNil(productProps.viewed) ||
        getUTCDate(productProps.viewed) <=
          getUTCDate(productMaster.lastUpdatedDate))
    );
  };

  render() {
    const { productMasters } = this.props;
    const { productLastViewed } = this.state;
    return (
      <View
        key={'view-productMasters-'.concat(productLastViewed)}
        style={{
          backgroundColor: 'white',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        {productMasters.map((productMaster) => (
          <View
            key={'view-'.concat(productMaster.key)}
            style={
              this.isNewlyModifiedNotViewed(productMaster)
                ? { backgroundColor: colors.lightGreen }
                : {}
            }
          >
            <Divider />
            <List.Item
              key={productMaster.key}
              left={() => {
                return (
                  <>
                    <Icon
                      reverse
                      name={ productMaster.type === 'Vaccine' ? 'syringe' : 'pills' }
                      color={ productMaster.showLink ? colors.darkColor : colors.orange }
                    />
                    {this.isNewlyModifiedNotViewed(productMaster) && (
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
              description={() => {
                return (
                  <Text>
                    <Text style={{ color: colors.grey }}>
                      {productMaster.ingredient}
                    </Text>
                    {productMaster.note.length > 0 && '\n'}
                    <Text style={{ color: colors.grey }}>
                      {productMaster.note}
                    </Text>
                    {'\n'}
                    <Text style={{ fontSize: 12 }}>
                      {productMaster.companyName}
                    </Text>
                  </Text>
                );
              }}
              onPress={() => {
                productMaster.showLink &&
                  this.handleProductOnPress(productMaster)
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
