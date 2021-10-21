import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, List, Divider } from 'react-native-paper';
import { EventRegister } from 'react-native-event-listeners';
import Icon from './Icon';
import { colors } from '../constants';
// services
import { notifications } from '../services';
import { getCurrentTimeInMillis } from '../shared/date-fns';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productLastViewed: getCurrentTimeInMillis()
    };
    this.addNotificationListener = this.addNotificationListener.bind(this);
    this.syncProduct = this.syncProduct.bind(this);
    this.handleProductOnPress = this.handleProductOnPress.bind(this);
  }

  componentDidMount() {
    this.addNotificationListener();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  addNotificationListener = () => {
    this.listener = EventRegister.addEventListener(
      'notificationEvent',
      (notification) => {
        if (notifications.isProductSpecific(notification)) {
          this.syncProduct(notification.data.nid);
        }
      }
    );
  };

  syncProduct = (nid) => {
    // TODO: for each product nid, re-fetch from api
    return nid;
  };

  handleProductOnPress = (productMaster) => {
    const { navigation } = this.props;
    const timeInMillis = getCurrentTimeInMillis();
    this.setState({
      productLastViewed: timeInMillis
    });
    // TODO: update product as viewed (storage and state store), then navigate (and don't show badge if viewed is within last 7 days)
    navigation.navigate('ProductDetails', { productMaster });
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
              productMaster.isNew || productMaster.isUpdated
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
                    {(productMaster.isNew || productMaster.isUpdated) && (
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
