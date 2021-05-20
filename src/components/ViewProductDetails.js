import React, { Component } from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { Card, ListItem, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { selectBookmarkByID } from '../redux/selectors/bookmarkSelector';
import { selectProductByID } from '../redux/selectors/productSelector';
import cheerio from 'react-native-cheerio';
import Icon from './Icon';
import { gStyle } from '../constants';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';

import { productResource } from '../services';

class ViewProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productMetadata: []
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
          var $ = cheerio.load(text), productMetadata = [];
          $('tbody').first().find('tr').map((i, row) => {
            var productInfo = { 'din': null, 'name': null, 'ingredient': null, 'strength': null, 'dosageForm': null, 'routeOfAdmin': null };
            $(row).find('td').map((j, div) => {
              switch (j) {
                case 0: productInfo.din = $(div).text().trim(); break;
                case 1: productInfo.name = $(div).text().trim(); break;
                case 2: productInfo.ingredient = $(div).text().trim(); break;
                case 3: productInfo.strength = $(div).text().trim(); break;
                case 4: productInfo.dosageForm = $(div).text().trim(); break;
                case 5: productInfo.routeOfAdmin = $(div).text().trim(); break;
              }
            });
            productMetadata.push(productInfo);
          });
          this.setState({
            productMetadata: productMetadata
          });
        });
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: 'white' }}>
        <Card style={{ flex: 1 }}>
          <Card.Title style={{ color: gStyle.tintColor.active.light, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{this.props.productMaster.brandName}</Card.Title>
          <View style={{ padding: 3 }}>
            <Text style={{ fontWeight: 'bold' }}>{this.props.productMaster.companyName}</Text>
            <Text style={{ fontSize: 9 }}>{ t('productDetails.card.companyNameLabel') }</Text>
          </View>
          <View style={{ padding: 3 }}>
            <Text style={{ fontWeight: 'bold' }}>{this.props.productMaster.ingredient}</Text>
            <Text style={{ fontSize: 9 }}>{ t('productDetails.card.ingredientLabel') }</Text>
          </View>
          <View style={{ padding: 3 }}>
            <Text style={{ fontWeight: 'bold' }}>{this.props.productMaster.status}</Text>
            <Text style={{ fontSize: 9 }}>{ t('productDetails.card.statusLabel') }</Text>
          </View>
          <View style={{ padding: 3 }}>
            <Text style={{ fontWeight: 'bold' }}>{this.props.productMaster.approvalDate}</Text>
            <Text style={{ fontSize: 9 }}>{ t('productDetails.card.approvalDateLabel') }</Text>
          </View>
          {
            this.state.productMetadata.map((product, key) => {
              return (
                <View key={'productMetadata' + key}>
                  <View style={{ padding: 3 }}>
                    <Text style={{ fontWeight: 'bold' }}>{ product.din }</Text>
                    <Text style={{ fontSize: 9 }}>{ t('productDetails.metadata.din') }</Text>
                  </View>
                  <View style={{ padding: 3, marginLeft: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>{ product.strength }</Text>
                    <Text style={{ fontSize: 9 }}>{ t('productDetails.metadata.strength') }</Text>
                  </View>
                  <View style={{ padding: 3, marginLeft: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>{ product.dosageForm }</Text>
                    <Text style={{ fontSize: 9 }}>{ t('productDetails.metadata.dosageForm') }</Text>
                  </View>
                  <View style={{ padding: 3, marginLeft: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>{ product.routeOfAdmin }</Text>
                    <Text style={{ fontSize: 9 }}>{ t('productDetails.metadata.administrationRoute') }</Text>
                  </View>
                </View>
              );
            })
          }
        </Card>
        {
          this.props.productResourceList.map( productResource =>
            <ListItem key={productResource.key} bottomDivider
              containerStyle={ (productResource.isNew || productResource.isUpdated) ? { backgroundColor: '#C1D699' } : { } }
              onPress={() => (this.linkingProductResource(productResource)) &&
                this.props.navigation.navigate('ProductResource', { productResource })}
            >
              <Icon size={25}
                name={ (productResource.resourceType === 'internal') ? 'file-alt' : 'globe' }
                color={ (productResource.resourceType !== 'pending') ? '#26374A': '#FF9F40' }
              />
              <ListItem.Content>
                <ListItem.Title style={{ fontWeight: 'bold' }}>
                  { productResource.resourceName }
                  { productResource.isNew && !productResource.isUpdated && <Badge value={t('common.badge.new')} status='success' /> }
                  { productResource.isUpdated && <Badge value={t('common.badge.updated')} status='warning' /> }  
                </ListItem.Title>
                <Text style={{ fontSize: 10 }}>{ productResource.description }</Text>
                { !this.props.settings.isOnline && 
                  <Text>{productResource.link.startsWith('/info')
                    ? '\n'+((this.props.settings.language === lang.english ? covidVaccinePortal : portailVaccinCovid) + productResource.link)
                    : '\n'+productResource.link}
                  </Text>
                }
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{ t('productDetails.listItem.publicationStatusLabel') }{ productResource.publicationStatus }</Text>
              </ListItem.Content>
              { (productResource.link && this.props.settings.isOnline) && <ListItem.Chevron color='blue'/> }
            </ListItem>
          )
        }
        </ScrollView>
      </View>
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

  return {
    settings: state.settings,
    productMaster: productMaster,
    productResourceList: productResourceList
  };
};

export default connect(mapStateToProps)(ViewProductDetails);
