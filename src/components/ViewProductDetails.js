import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, Linking } from 'react-native';
import { Badge, Card, List, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import HTML from 'react-native-render-html';
import Icon from './Icon';
import { colors, gStyle } from '../constants';
import { selectBookmarkByID } from '../redux/selectors/bookmarkSelector';
import { selectProductByID } from '../redux/selectors/productSelector';
// services
import { productLoad, productResource, productsParser } from '../services';
// components
import ReadMoreText from './ReadMoreText';
import ViewCardText from './ViewCardText';
import ViewLabelledText from './ViewLabelledText';

class ViewProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productMetadata: [],
      consumerInformation: [],
      regulatoryAnnouncements: []
    };
  }

  /** ***********************************************************************************
   * 1. Extract from redux store Product Resource details
   *
   */

  componentDidMount() {
    const {
      consumerInformationResource,
      settings,
      productMetadata,
      consumerInformation,
      regulatoryAnnouncements
    } = this.props;
    if (consumerInformationResource) {
      if (settings.isOnline) {
        // online, load/scrape
        productLoad.loadConsumerInformation(consumerInformationResource.link, settings.language)
          .then((productPortalInfo) => {
            this.setState({
              productMetadata: productPortalInfo.productMetadata,
              consumerInformation: productPortalInfo.consumerInformation,
              regulatoryAnnouncements: productPortalInfo.regulatoryAnnouncements
            });
          });
      } else {
        // offline, set from state/storage (bookmarks)
        this.setState({
          productMetadata,
          consumerInformation,
          regulatoryAnnouncements
        });
      }
    }
  }

  linkingProductResource(productResource) {
    const { settings } = this.props;
    if (productResource.link && settings.isOnline) {
      if (productResource.resourceType === 'external') {
        // console.log('external product resource (show in browser): ' + productResource.link);
        Linking.canOpenURL(productResource.link).then((supported) => {
          if (supported) {
            Linking.openURL(productResource.link);
          }
        });
      }
    }
    // if there is no link or we have displayed an external link in the browser, return false to short-circuit the logic
    return false;
  }

  linkingRegulatoryAnnouncement(regulatoryAnnouncement) {
    const { settings } = this.props;
    if (regulatoryAnnouncement.link && settings.isOnline) {
      // console.log('external regulatory announcement (show in browser): ' + regulatoryAnnouncement.link);
      Linking.canOpenURL(regulatoryAnnouncement.link).then((supported) => {
        if (supported) {
          Linking.openURL(regulatoryAnnouncement.link);
        }
      });
    }
    // if there is no link or we have displayed an external link in the browser, return false to short-circuit the logic
    return false;
  }

  checkForUpdatedOrNewResource() {
    const { productResourceList } = this.props;
    if (
      productResourceList.some((resource) => {
        return resource.isUpdated;
      })
    ) {
      return 'updated';
    }
    if (
      productResourceList.some((resource) => {
        return resource.isNew;
      })
    ) {
      return 'new';
    }
    return '';
  }

  render() {
    const { productMaster, productResourceList, settings } = this.props;
    const { productMetadata, consumerInformation, regulatoryAnnouncements } = this.state;
    return (
      <>
        <View style={gStyle.spacer8} />
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Card
              style={{ borderRadius: 0, marginHorizontal: 0, marginTop: 0 }}
            >
              <Card.Content style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    color: colors.blue,
                    fontWeight: 'bold',
                    fontSize: 18
                  }}
                >
                  {productMaster.brandName}
                </Text>
              </Card.Content>
              <View style={gStyle.spacer16} />
              <Card.Content>
                <ViewLabelledText
                  text={productMaster.companyName}
                  label={t('productDetails.card.companyNameLabel')}
                />
                <ViewLabelledText
                  text={productMaster.ingredient}
                  label={t('productDetails.card.ingredientLabel')}
                />
                <ViewLabelledText
                  text={productMaster.status}
                  label={t('productDetails.card.statusLabel')}
                />
                <ViewLabelledText
                  text={productMaster.approvalDateFormatted}
                  label={t('productDetails.card.approvalDateLabel')}
                />
              </Card.Content>
            </Card>
          </View>
          <View
            style={[gStyle.spacer8, { backgroundColor: colors.lightGrey }]}
          />
          <List.AccordionGroup>
            <List.Accordion
              id="pri"
              title={t('productDetails.accordion.pri')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue } }}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="card-text-outline"
                  style={{ marginHorizontal: 0 }}
                />
              )}
            >
              {productMetadata.map((product, key) => {
                return (
                  <View
                    key={'productMetadata' + key}
                    style={{ marginLeft: -50, marginBottom: 15 }}
                  >
                    <ViewLabelledText
                      text={product.din}
                      label={t('productDetails.metadata.din')}
                    />
                    <ViewLabelledText
                      text={product.strength}
                      label={t('productDetails.metadata.strength')}
                    />
                    <ViewLabelledText
                      text={product.dosageForm}
                      label={t('productDetails.metadata.dosageForm')}
                    />
                    <ViewLabelledText
                      text={product.routeOfAdmin}
                      label={t('productDetails.metadata.administrationRoute')}
                    />
                  </View>
                );
              })}
            </List.Accordion>
            <Divider />
            <List.Accordion
              id="pmi"
              title={t('productDetails.accordion.pmi')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue } }}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="comment-question-outline"
                  style={{ marginHorizontal: 0 }}
                />
              )}
            >
              <ViewCardText
                text={t('productDetails.card.consumerInformationText')}
              />
              <List.AccordionGroup>
                {consumerInformation.map((accordionItem) => (
                  <View key={'view-'.concat(accordionItem.key)}>
                    <Divider />
                    <List.Accordion
                      id={accordionItem.key}
                      title={accordionItem.summary}
                      titleNumberOfLines={2}
                      theme={{ colors: { primary: colors.blue } }}
                    >
                      <HTML
                        source={{ html: accordionItem.html }}
                        containerStyle={{ marginHorizontal: 20 }}
                      />
                    </List.Accordion>
                  </View>
                ))}
              </List.AccordionGroup>
            </List.Accordion>
            <Divider />
            <List.Accordion
              id="add"
              title={t('productDetails.accordion.add')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue } }}
              left={(props) => {
                const isUpdatedOrNew = this.checkForUpdatedOrNewResource();
                return (
                  <>
                    <List.Icon
                      {...props}
                      icon="web"
                      style={{ marginHorizontal: 0 }}
                    />
                    {isUpdatedOrNew !== '' && (
                      <Badge
                        size={16}
                        style={[
                          styles.updateIndicatorBadge,
                          {
                            backgroundColor:
                              isUpdatedOrNew === 'new'
                                ? colors.green
                                : colors.orange
                          }
                        ]}
                      />
                    )}
                  </>
                );
              }}
            >
              <View style={{ marginLeft: -64 }}>
                {productResourceList.map((productResource) => (
                  <View
                    key={'view-'.concat(productResource.key)}
                    style={ (productResource.isNew || productResource.isUpdated) ? { backgroundColor: colors.lightGreen } : {} }
                  >
                    <Divider />
                    <List.Item
                      key={productResource.key}
                      title={
                        <Text>
                          <Text>{productResource.resourceName.trim()}</Text>
                          <View>
                            { productResource.isNew && !productResource.isUpdated && <Badge style={[styles.updateBadge, {backgroundColor: colors.green}]}>{t('common.badge.new')}</Badge> }
                            { productResource.isUpdated && <Badge style={[styles.updateBadge, {backgroundColor: colors.orange}]}>{t('common.badge.updated')}</Badge> }
                          </View>
                        </Text>
                      }
                      titleStyle={{ fontWeight: 'bold', fontSize: 16 }}
                      titleNumberOfLines={2}
                      description={() => (
                        <>
                          <Text>
                            <Text style={{ fontSize: 12 }}>
                              {t('productDetails.listItem.publicationStatusLabel')}{productResource.publicationStatus}
                            </Text>
                            {'\n'}
                          </Text>
                          <ReadMoreText
                            text={productResource.description}
                            numberOfLines={1}
                          />
                        </>
                      )}
                      onPress={() => {
                        this.linkingProductResource(productResource);
                      }}
                      right={() => {
                        return productResource.link && settings.isOnline
                          ? <Icon name='open-in-new' type='material-community' color={colors.darkColor} containerStyle={{ justifyContent: 'flex-start', marginTop: 12, marginRight: 10 }} />
                          : null;
                      }}
                    />
                  </View>
                ))}
              </View>
            </List.Accordion>
            <Divider />
            <List.Accordion
              id="reg"
              title={t('productDetails.accordion.reg')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue }}}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="bullhorn-outline"
                  style={{ marginHorizontal: 0 }}
                />
              )}
            >
              {regulatoryAnnouncements.map((regulatoryAnnouncement) => (
                <View
                  key={'view-'.concat(regulatoryAnnouncement.key)}
                  style={{ marginLeft: -64 }}
                >
                  <Divider />
                  <List.Item
                    key={regulatoryAnnouncement.key}
                    title={regulatoryAnnouncement.date}
                    description={() => (
                      <ReadMoreText
                        text={regulatoryAnnouncement.description}
                        numberOfLines={2}
                      />
                    )}
                    onPress={() => {
                      this.linkingRegulatoryAnnouncement(regulatoryAnnouncement);
                    }}
                    right={() => {
                      return regulatoryAnnouncement.link && settings.isOnline
                        ? <Icon name='open-in-new' type='material-community' color={colors.darkColor} containerStyle={{ justifyContent: 'flex-start', marginTop: 12, marginRight: 10 }} /> 
                        : null;
                    }}
                  />
                </View>
              ))}
              {regulatoryAnnouncements.length === 0 && (
                <ViewCardText
                  text={t('productDetails.emptyText.reg')}
                  style={{ marginLeft: -64 }}
                />
              )}
            </List.Accordion>
            <Divider />
          </List.AccordionGroup>
        </ScrollView>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var productMaster, product, productResourceList = [], consumerInformationResource, productMetadata, consumerInformation, regulatoryAnnouncements;

  // Product Master:
  productMaster = ownProps.route.params.productMaster;

  // Product Resources:
  const key = productMaster.key.toString();
  if (key.startsWith('bookmark-product')) {
    product = selectBookmarkByID(state, ownProps.route.params.productMaster.nid);
    if (typeof product !== 'undefined') {
      productMetadata = product.productMetadata;
      consumerInformation = product.consumerInformation;
      regulatoryAnnouncements = product.regulatoryAnnouncements;
    }
  } else {
    product = selectProductByID(state, ownProps.route.params.productMaster.nid);
  }

  // Push all of the Product Resources into props, but extract Consumer Information if it is in there
  if (typeof product !== 'undefined') {
    productResourceList.push(
      ...productResource.mapProductResources(product, state.settings.language)
    );
    consumerInformationResource = productResourceList.find((resource) => {
      if (productsParser.isProductResourceNameConsumerInfo(resource.resourceName)) {
        return resource;
      }
    });
    productResourceList = productResourceList.filter((resource) => {
      if (!productsParser.isProductResourceNameConsumerInfo(resource.resourceName)) {
        return resource;
      }
    });
  }

  return {
    settings: state.settings,
    productMaster,
    productResourceList,
    consumerInformationResource,
    productMetadata,
    consumerInformation,
    regulatoryAnnouncements
  };
};

const styles = StyleSheet.create({
  updateBadge: {
    color: colors.white,
    marginLeft: 4,
    marginRight: 4,
    paddingHorizontal: 8
  },
  updateIndicatorBadge: {
    position: 'absolute',
    top: 8,
    left: 22
  }
});

export default connect(mapStateToProps)(ViewProductDetails);
