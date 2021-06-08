import React, { Component } from 'react';
import { View, ScrollView, Text, Linking } from 'react-native';
import { Card, ListItem, Badge, Tooltip} from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { selectBookmarkByID } from '../redux/selectors/bookmarkSelector';
import { selectProductByID } from '../redux/selectors/productSelector';
import Icon from './Icon';

import { colors, gStyle } from '../constants';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';
import HTML from 'react-native-render-html';
import { List, Divider } from 'react-native-paper';

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
    }
  }

  /*************************************************************************************
   * 1. Extract from redux store Product Master and Product Resource details
   * 
   * We have the Product Master from the previous screen, but reloading it from state for resources mapping 
   */

  componentDidMount() {
    if (this.props.consumerInformationResource) {
      if (this.props.settings.isOnline) {
        // online, load/scrape
        productLoad.loadConsumerInformation(this.props.consumerInformationResource.link, this.props.settings.language)
        .then(productPortalInfo => {
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
//          regulatoryAnnouncements: this.props.regulatoryAnnouncements
        });
      }
    }
  }

  render() {
    return (
      <>
      <View style={gStyle.spacer8} />
      <ScrollView style={{ backgroundColor: 'white' }}>
        <Card style={{ flex: 1 }}>
          <Card.Title style={{ color: gStyle.tintColor.active.light, fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>{this.props.productMaster.brandName}</Card.Title>
          <ViewLabelledText text={ this.props.productMaster.companyName} label={ t('productDetails.card.companyNameLabel') } />
          <ViewLabelledText text={ this.props.productMaster.ingredient } label={ t('productDetails.card.ingredientLabel') } />
          <ViewLabelledText text={ this.props.productMaster.status } label={ t('productDetails.card.statusLabel') } />
          <ViewLabelledText text={ this.props.productMaster.approvalDate } label={ t('productDetails.card.approvalDateLabel') } />
        </Card>
        <View style={{ height: 8, width: '100%', backgroundColor: '#f2f2f2' }} />
        <List.AccordionGroup>
          <List.Accordion title={ t('productDetails.accordion.pri') } id='pri' titleStyle={{ fontWeight: 'bold' }} titleNumberOfLines={2} theme={{ colors: { primary: colors.blue }}}
              left={props => <List.Icon {...props} icon='card-text-outline' style={{ marginHorizontal: 0 }}/>}>
            {
              this.state.productMetadata.map((product, key) => {
                return (
                  <View key={'productMetadata' + key} style={{ marginLeft: -50, marginBottom: 15 }}>
                    <ViewLabelledText text={ product.din } label={ t('productDetails.metadata.din') } />
                    <ViewLabelledText text={ product.strength } label={ t('productDetails.metadata.strength') } />
                    <ViewLabelledText text={ product.dosageForm } label={ t('productDetails.metadata.dosageForm') } />
                    <ViewLabelledText text={ product.routeOfAdmin } label={ t('productDetails.metadata.administrationRoute') } />
                  </View>
                );
              })
            }
          </List.Accordion>
          <Divider/>
          <List.Accordion title={ t('productDetails.accordion.pmi') } id='pmi' titleStyle={{ fontWeight: 'bold' }} titleNumberOfLines={2} theme={{ colors: { primary: colors.blue }}}
              left={props => <List.Icon {...props} icon='comment-question-outline' style={{ marginHorizontal: 0 }}/>}>
            <ViewCardText text={ t('productDetails.card.consumerInformationText') } />
            <List.AccordionGroup>
            {
                this.state.consumerInformation.map( accordionItem =>
                <View key={ 'view-'.concat(accordionItem.key) }>
                  <Divider/>
                  <List.Accordion title={ accordionItem.summary } id={ accordionItem.key } titleNumberOfLines={2} theme={{ colors: { primary: colors.blue }}} >
                    <HTML source= {{ html: accordionItem.html }} containerStyle={{ marginHorizontal: 20 }}/>
                  </List.Accordion>
                </View>
                )
              }
            </List.AccordionGroup>
          </List.Accordion>
          <Divider/>
          <List.Accordion title={ t('productDetails.accordion.add') } id='add' titleStyle={{ fontWeight: 'bold' }} titleNumberOfLines={2} theme={{ colors: { primary: colors.blue }}}
            left={props => <List.Icon {...props} icon='web' style={{ marginHorizontal: 0 }}/>}>
            <View style={{ marginLeft: -64 }}>
            {
              this.props.productResourceList.map( productResource =>
                <ListItem key={productResource.key} topDivider
                  containerStyle={ (productResource.isNew || productResource.isUpdated) ? { backgroundColor: '#C1D699' } : { } }
                  onPress={ () => this.linkingProductResource(productResource) }
                >
                  <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: 'bold', fontSize: 16 }}>
                      { productResource.resourceName + ' '}
                      <Tooltip popover={<Text>{ productResource.description }</Text>}
                        height={304} width={288} skipAndroidStatusBar={true} backgroundColor={'#CECECE'}>
                        <Icon size={20} name='info-circle' color='#26374A' />
                      </Tooltip>
                      { productResource.isNew && !productResource.isUpdated && <Badge value={t('common.badge.new')} status='success' /> }
                      { productResource.isUpdated && <Badge value={t('common.badge.updated')} status='warning' /> }  
                    </ListItem.Title>
                    { (false) && <Text style={{ fontSize: 10 }}>{  }</Text> }
                    { !this.props.settings.isOnline && 
                      <Text style={{ fontSize: 10 }}>{productResource.link.startsWith('/info')
                        ? '\n'+((this.props.settings.language === lang.english ? covidVaccinePortal : portailVaccinCovid) + productResource.link)+'\n'
                        : '\n'+productResource.link+'\n'}
                      </Text>
                    }
                    <ListItem.Subtitle style={{ fontSize: 12 }}>{ t('productDetails.listItem.publicationStatusLabel') }{ productResource.publicationStatus }</ListItem.Subtitle>
                  </ListItem.Content>
                  { (productResource.link && this.props.settings.isOnline) && <ListItem.Chevron color='blue'/> }
                </ListItem>
              )
            }
            </View>
          </List.Accordion>
          <Divider/>
          <List.Accordion title={ t('productDetails.accordion.reg') } id='reg' titleStyle={{ fontWeight: 'bold' }} titleNumberOfLines={2} theme={{ colors: { primary: colors.blue }}}
              left={props => <List.Icon {...props} icon='comment-alert-outline' style={{ marginHorizontal: 0 }}/>}>
            <View style={{ marginLeft: -64 }}>
            {
              this.state.regulatoryAnnouncements.map( regulatoryAnnouncement =>
                <List.Item id={ regulatoryAnnouncement.key }
                  title={ regulatoryAnnouncement.date }
                  description={ regulatoryAnnouncement.description }
                  onPress={ () => this.linkingProductResource(productResource) }
                  right={props => <List.Icon {...props} icon='open-in-new' />}
                />
              )
            }
            </View>
          </List.Accordion>
          <Divider/>
        </List.AccordionGroup>
      </ScrollView>
      </>
    );
  }

  linkingProductResource(productResource) {
    if (productResource.link && this.props.settings.isOnline) {
      if (productResource.resourceType === 'external') {
        //console.log('external product resource (show in browser): ' + productResource.link);
        Linking.canOpenURL(productResource.link).then( supported => {
          if (supported) {
            Linking.openURL(productResource.link);
          }
        }) 
      }
    }
    // if there is no link or we have displayed an external link in the browser, return false to short-circuit the logic
    return false;
  }
}

const mapStateToProps = (state, ownProps) => {
  var productMaster, product, productResourceList = [], consumerInformationResource, productMetadata, consumerInformation;
  
  // Product Master:
  productMaster = ownProps.route.params.productMaster;

  // Product Resources:
  const key = productMaster.key.toString();
  if (key.startsWith('bookmark-product')) {
    product = selectBookmarkByID(state, ownProps.route.params.productMaster.nid);
    if (typeof product !== 'undefined') {
      productMetadata = product.productMetadata;
      consumerInformation = product.consumerInformation;
    }
  } else {
    product = selectProductByID(state, ownProps.route.params.productMaster.nid);
  }

  // Push all of the Product Resources into props, but extract Consumer Information if it is in there
  if (typeof product !== 'undefined') {
    productResourceList.push(...productResource.mapProductResources(product, state.settings.language));
    consumerInformationResource = productResourceList.find(resource => { 
      if (productsParser.isProductResourceNameConsumerInfo(resource.resourceName)) {
        return resource;
      }
    });
    productResourceList = productResourceList.filter(resource => { 
      if (!productsParser.isProductResourceNameConsumerInfo(resource.resourceName)) {
        return resource;
      }
    });
  }

  return {
    settings: state.settings,
    productMaster: productMaster,
    productResourceList: productResourceList,
    consumerInformationResource: consumerInformationResource,
    productMetadata: productMetadata,
    consumerInformation: consumerInformation
  };
};

export default connect(mapStateToProps)(ViewProductDetails);
