import React, { Component } from 'react';
import { View, ScrollView, Text, Linking } from 'react-native';
import { Card, ListItem, Badge, Tooltip} from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { selectBookmarkByID } from '../redux/selectors/bookmarkSelector';
import { selectProductByID } from '../redux/selectors/productSelector';
import cheerio from 'react-native-cheerio';
import Icon from './Icon';
import { gStyle } from '../constants';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';
import HTML from 'react-native-render-html';
import { List, Divider } from 'react-native-paper';

// services
import { productResource } from '../services';

// components
import ViewLabelledText from './ViewLabelledText';

class ViewProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productMetadata: [],
      consumerInformation: []
    }
  }

  /*************************************************************************************
   * 1. Extract from redux store Product Master and Product Resource details
   * 
   * [pmh] we have the Product Master from the previous screen, but reload it anyway 
   */

  componentDidMount() {
    if (this.props.settings.isOnline) {
      let consumerInformationResource = this.props.productResourceList.find((resource, ind, arr) => { 
        if (resource.resourceName === 'Consumer Information' || resource.resourceName.toLowerCase().includes('consommateurs')) {
          return resource;
        }
      });

      if (consumerInformationResource) {
        const cvtPortal = (this.props.settings.language === lang.english) ? covidVaccinePortal : portailVaccinCovid;
        var url = cvtPortal + consumerInformationResource.link;            
        fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 
          var $ = cheerio.load(text), productMetadata = [], consumerInformation = [];
          
          // Extract Product Metadata from COVID Portal Consumer Information
          $('tbody').first().find('tr').each((i, row) => {
            var noMatch = true
              , productInfo = { 'din': null, 'name': null, 'ingredient': null, 'strength': null, 'dosageForm': null, 'routeOfAdmin': null };
            $(row).find('td').each((j, div) => {
              switch (j) {
                case 0: productInfo.din = $(div).text().trim(); break;
                case 1: productInfo.name = $(div).text().trim(); break;
                case 2: productInfo.ingredient = $(div).text().trim(); break;
                case 3: productInfo.strength = $(div).text().trim(); break;
                case 4: productInfo.dosageForm = $(div).text().trim(); break;
                case 5: productInfo.routeOfAdmin = $(div).text().trim(); break;
              }
            });

            // If two Products are identical, just add the DIN to the existing Product instead of adding it to the Product Metadata array
            productMetadata.forEach((prodInfo, ind) => {
              existProduct = [prodInfo.name, prodInfo.ingredient, prodInfo.strength, prodInfo.dosageForm, prodInfo.routeOfAdmin].join('|');
              matchProduct = [productInfo.name, productInfo.ingredient, productInfo.strength, productInfo.dosageForm, productInfo.routeOfAdmin].join('|');
              if (existProduct === matchProduct) {
                prodInfo.din += (', ' + productInfo.din);
                noMatch = false;
              }
            });
            if (noMatch) {
              productMetadata.push(productInfo);            
            }
          });

          //Extract Accordion data from COVID Portal Consumer Information
          $('details.span-8').parent().each((i, detail) => {
            const accordionItem = {
              summary: $(detail).find('summary').text(),
              html: $(detail).find('div').html(),
              key: i
            };
            consumerInformation.push(accordionItem);
          });
//          console.log('Consumer Information: ' + consumerInformation)

          this.setState({
            productMetadata: productMetadata,
            consumerInformation: consumerInformation
          });
        });
      }
    }
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <Card style={{ flex: 1 }}>
          <Card.Title style={{ color: gStyle.tintColor.active.light, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{this.props.productMaster.brandName}</Card.Title>
          <ViewLabelledText text={ this.props.productMaster.companyName} label={ t('productDetails.card.companyNameLabel') } />
          <ViewLabelledText text={ this.props.productMaster.ingredient } label={ t('productDetails.card.ingredientLabel') } />
          <ViewLabelledText text={ this.props.productMaster.status } label={ t('productDetails.card.statusLabel') } />
          <ViewLabelledText text={ this.props.productMaster.approvalDate } label={ t('productDetails.card.approvalDateLabel') } />
          {
            this.state.productMetadata.map((product, key) => {
              return (
                <View key={'productMetadata' + key}>
                  <ViewLabelledText text={ product.din } label={ t('productDetails.metadata.din') } />
                  <ViewLabelledText text={ product.strength } label={ t('productDetails.metadata.strength') } />
                  <ViewLabelledText text={ product.dosageForm } label={ t('productDetails.metadata.dosageForm') } />
                  <ViewLabelledText text={ product.routeOfAdmin } label={ t('productDetails.metadata.administrationRoute') } />
                </View>
              );
            })
          }
        </Card>
        <List.AccordionGroup>
          <List.Accordion title='Frequently Asked Questions' id='faq' titleStyle={{ fontWeight: 'bold' }}
            left={props => <List.Icon {...props} icon='comment-question-outline' style={{ marginHorizontal: 0 }}/>}>
            <List.AccordionGroup>
              {
                this.state.consumerInformation.map( accordionItem =>
                <View>
                  <Divider/>
                  <List.Accordion title={ accordionItem.summary } id={ accordionItem.key }>
                    <HTML source= {{ html: accordionItem.html }} containerStyle={{ marginHorizontal: 20 }}/>
                  </List.Accordion>
                </View>
                )
              }
            </List.AccordionGroup>
          </List.Accordion>
          <Divider/>
        </List.AccordionGroup>
        {
              this.props.productResourceList.map( productResource =>
                <ListItem key={productResource.key} bottomDivider
                  containerStyle={ (productResource.isNew || productResource.isUpdated) ? { backgroundColor: '#C1D699' } : { } }
                  onPress={() => (this.linkingProductResource(productResource)) &&
                    this.props.navigation.navigate('ProductResource', { productResource })}
                >
                  <Icon size={22} style={{ marginHorizontal: 2 }}
                    name={ (productResource.resourceType === 'infernal') ? 'file-alt' : 'globe' }
                    color={ (productResource.resourceType !== 'pending') ? '#26374A': '#FF9F40' }
                  />
                  <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: 'bold', fontSize: 16 }}>
                      { productResource.resourceName + ' '}
                      <Tooltip popover={<Text>{ productResource.description }</Text>}
                        height={200} width={250} >
                        <Icon size={15} name='info-circle' color='blue'/>
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
                    <ListItem.Subtitle style={{ fontSize: 12, fontWeight: 'bold' }}>{ t('productDetails.listItem.publicationStatusLabel') }{ productResource.publicationStatus }</ListItem.Subtitle>
                  </ListItem.Content>
                  { (productResource.link && this.props.settings.isOnline) && <ListItem.Chevron color='blue'/> }
                </ListItem>
              )
            }
      </ScrollView>
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
      } else {
        //console.log('internal product resource (show in WebView): ' + productResource.link);
        return true;  
      }
    }
    // if there is no link or we have displayed an external link in the browser, return false to short-circuit the logic
    return false;
  }
}

const mapStateToProps = (state, ownProps) => {
  var productMaster, product, productResourceList = [];
  
  // Product Master:
  productMaster = ownProps.route.params.productMaster;

  // Product Resources:
  const key = productMaster.key.toString();
  if (key.startsWith('bookmark-product')) {
    product = selectBookmarkByID(state, ownProps.route.params.productMaster.nid);
  } else {
    product = selectProductByID(state, ownProps.route.params.productMaster.nid);
  }
  if (typeof product !== 'undefined') {
    productResourceList.push(...productResource.mapProductResources(product, state.settings.language));
  }

  const consumerInformationResource = productResourceList.shift();
//  productResourceList.push(consumerInformationResource);

  return {
    settings: state.settings,
    productMaster: productMaster,
    productResourceList: productResourceList
  };
};

export default connect(mapStateToProps)(ViewProductDetails);
