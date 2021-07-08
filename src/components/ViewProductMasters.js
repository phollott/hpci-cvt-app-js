import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, List, Divider } from 'react-native-paper';
import { EventRegister } from 'react-native-event-listeners';
import Icon from './Icon';
import { colors } from '../constants';
// services
import { notifications } from '../services';

export default class ViewProductMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productNidsWithUnreadNotification: [],
      unreadProductNidsUpdatedTime: 0
    };
    this.addNotificationEventListener = this.addNotificationEventListener.bind(this);
    this.updateUnreadProductNids = this.updateUnreadProductNids.bind(this);
    this.handleProductListItemOnPress = this.handleProductListItemOnPress.bind(this);
    this.resetStack = this.resetStack.bind(this);
  }

  componentDidMount() {
    this.addNotificationEventListener();
    this.updateUnreadProductNids();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  addNotificationEventListener = () => {
    this.listener = EventRegister.addEventListener('notificationEvent', () => {
      this.updateUnreadProductNids();
    });
  };

  updateUnreadProductNids = () => {
    notifications.findProductNidsWithUnreadNotification().then((nids) => {
      const timeInMillis = new Date().getTime();
      this.setState({
        productNidsWithUnreadNotification: nids,
        unreadProductNidsUpdatedTime: timeInMillis
      });
    });
  };

  handleProductListItemOnPress = (productMaster) => {
    const { navigation } = this.props;
    const { productNidsWithUnreadNotification } = this.state;
    if (productNidsWithUnreadNotification.includes(parseInt(productMaster.nid, 10))) {
      notifications
        .updateNotificationsAsReadForProduct(productMaster.nid)
        .then(() => {
          this.updateUnreadProductNids();
          this.resetStack(productMaster.isBookmark);
          navigation.navigate('ProductDetails', { productMaster });
        });
    } else {
      navigation.navigate('ProductDetails', { productMaster });
    }
  };

  resetStack = (isBookmark) => {
    const { navigation } = this.props;
    const { unreadProductNidsUpdatedTime } = this.state;
    // reset other stack
    if (isBookmark) {
      navigation.navigate('ProductsStack', {
        screen: 'Products',
        params: {
          productAction: '-'.concat(unreadProductNidsUpdatedTime)
        }
      });
    } else {
      navigation.navigate('BookmarksStack', {
        screen: 'Bookmarks',
        params: {
          bookmarkAction: '-'.concat(unreadProductNidsUpdatedTime)
        }
      });
    }
  };

  render() {
    const { productNidsWithUnreadNotification, unreadProductNidsUpdatedTime } = this.state;
    return (
      <View
        key={'view-productMasters-'.concat(unreadProductNidsUpdatedTime)}
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
                productMaster.showLink &&
                this.handleProductListItemOnPress(productMaster)
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
