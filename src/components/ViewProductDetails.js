import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, Linking } from 'react-native';
import { Badge, Card, List, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import ReadMore from 'react-native-read-more-text';
import HTML from 'react-native-render-html';
import Icon from './Icon';
import { colors, gStyle } from '../constants';
import { selectBookmarkByID } from '../redux/selectors/bookmarkSelector';
import { selectProductByID } from '../redux/selectors/productSelector';
// services
import { productLoad, productResource, productsParser } from '../services';
// components
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
   * 1. Extract from redux store Product Master and Product Resource details
   *
   * We have the Product Master from the previous screen, but reloading it from state for resources mapping 
   */

  componentDidMount() {
    if (this.props.consumerInformationResource) {
      if (this.props.settings.isOnline) {
        // online, load/scrape
        productLoad.loadConsumerInformation(this.props.consumerInformationResource.link, this.props.settings.language)
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
          productMetadata: this.props.productMetadata,
          consumerInformation: this.props.consumerInformation,
          regulatoryAnnouncements: this.props.regulatoryAnnouncements
        });
      }
    }
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: colors.blue, marginTop: 5 }} onPress={handlePress}>
        {t('common.readText.more')}
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: colors.blue, marginTop: 5 }} onPress={handlePress}>
        {t('common.readText.less')}
      </Text>
    );
  };

  _handleTextReady = () => {
    // ...
  };

  linkingProductResource(productResource) {
    if (productResource.link && this.props.settings.isOnline) {
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
    if (regulatoryAnnouncement.link && this.props.settings.isOnline) {
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

  render() {
    return (
      <>
        <View style={gStyle.spacer8} />
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Card style={{ borderRadius: 0, marginHorizontal: 0, marginTop: 0 }}>
              <Card.Content style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.blue, fontWeight: 'bold', fontSize: 18 }}>
                  {this.props.productMaster.brandName}
                </Text>
              </Card.Content>
              <View style={gStyle.spacer16} />
              <Card.Content>
                <ViewLabelledText text={this.props.productMaster.companyName} label={t('productDetails.card.companyNameLabel')} />
                <ViewLabelledText text={this.props.productMaster.ingredient} label={t('productDetails.card.ingredientLabel')} />
                <ViewLabelledText text={this.props.productMaster.status} label={t('productDetails.card.statusLabel')} />
                <ViewLabelledText text={this.props.productMaster.approvalDateFormatted} label={t('productDetails.card.approvalDateLabel')} />
              </Card.Content>
            </Card>
          </View>
          <View style={[gStyle.spacer8, { backgroundColor: colors.lightGrey }]} />
          <List.AccordionGroup>
            <List.Accordion
              id="pri"
              title={t('productDetails.accordion.pri')}
              titleStyle={{ fontWeight: 'bold' }}
              titleNumberOfLines={2}
              theme={{ colors: { primary: colors.blue } }}
              left={(props) => 
                <List.Icon {...props} icon="card-text-outline" style={{ marginHorizontal: 0 }} />
              }
            >
              {this.state.productMetadata.map((product, key) => {
                return (
                  <View key={'productMetadata' + key} style={{ marginLeft: -50, marginBottom: 15 }}>
                    <ViewLabelledText text={product.din} label={t('productDetails.metadata.din')} />
                    <ViewLabelledText text={product.strength} label={t('productDetails.metadata.strength')} />
                    <ViewLabelledText text={product.dosageForm} label={t('productDetails.metadata.dosageForm')} />
                    <ViewLabelledText text={product.routeOfAdmin} label={t('productDetails.metadata.administrationRoute')} />
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
                <List.Icon {...props} icon="comment-question-outline" style={{ marginHorizontal: 0 }} />
              )}
            >
              <ViewCardText text={t('productDetails.card.consumerInformationText')} />
              <List.AccordionGroup>
                {this.state.consumerInformation.map((accordionItem) => (
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
              left={(props) => (
                <List.Icon {...props} icon='web' style={{ marginHorizontal: 0 }} />
              )}
            >
              <View style={{ marginLeft: -64 }}>
                {this.props.productResourceList.map((productResource) => (
                  <View key={'view-'.concat(productResource.key)}
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
                          <ReadMore
                            numberOfLines={1}
                            renderTruncatedFooter={this._renderTruncatedFooter}
                            renderRevealedFooter={this._renderRevealedFooter}
                            onReady={this._handleTextReady}
                          >
                            <Text>{productResource.description}</Text>
                          </ReadMore>
                        </>
                      )}
                      onPress={() => {
                        this.linkingProductResource(productResource);
                      }}
                      right={() => {
                        return productResource.link && this.props.settings.isOnline
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
                <List.Icon {...props} icon="bullhorn-outline" style={{ marginHorizontal: 0 }} />
              )}
            >
              {this.state.regulatoryAnnouncements.map((regulatoryAnnouncement) => (
                <View key={'view-'.concat(regulatoryAnnouncement.key)} style={{ marginLeft: -64 }}>
                  <Divider />
                  <List.Item
                    key={regulatoryAnnouncement.key}
                    title={regulatoryAnnouncement.date}
                    description={() => (
                      <ReadMore
                        numberOfLines={2}
                        renderTruncatedFooter={this._renderTruncatedFooter}
                        renderRevealedFooter={this._renderRevealedFooter}
                        onReady={this._handleTextReady}
                      >
                        <Text>{regulatoryAnnouncement.description}</Text>
                      </ReadMore>
                    )}
                    onPress={() => {
                      this.linkingRegulatoryAnnouncement(regulatoryAnnouncement);
                    }}
                    right={() => {
                      return regulatoryAnnouncement.link && this.props.settings.isOnline
                        ? <Icon name='open-in-new' type='material-community' color={colors.darkColor} containerStyle={{ justifyContent: 'flex-start', marginTop: 12, marginRight: 10 }} /> 
                        : null;
                    }}
                  />
                </View>
              ))}
              {
                this.state.regulatoryAnnouncements.length === 0 &&
                <ViewCardText text={t('productDetails.emptyText.reg')} style={{ marginLeft: -64 }} />
              }
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
  }
});

export default connect(mapStateToProps)(ViewProductDetails);
