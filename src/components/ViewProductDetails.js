import React, { Component } from 'react';
import { Text, View, ScrollView, Linking } from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';


class ViewProductDetails extends Component {
  constructor(props) {
    super(props);
  }

  /*************************************************************************************
   * 1. Extract from redux store Product Master and Product Resource details
   * 
   * [pmh] we have the Product Master from the previous screen, but reload it anyway 
   */

  componentDidMount() {
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <Card style={{ flex: 1 }}>
          <Card.Title>Product Description</Card.Title>
          <Text><Text style={{ fontWeight: 'bold' }}>Brand Name: </Text>{this.props.productMaster.brandName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Company Name: </Text>{this.props.productMaster.companyName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Ingredient: </Text>{this.props.productMaster.ingredient}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status: </Text>{this.props.productMaster.status}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Date of approval: </Text>{this.props.productMaster.approvalDate}</Text>
        </Card>
        <ScrollView>
        {
          this.props.productResourceList.map( productResource =>
            <ListItem key={productResource.key} bottomDivider
              onPress={() => (this.linkingProductResource(productResource)) &&
                this.props.navigation.navigate('ProductResource', { productResource })}
            >
              <Icon type='font-awesome-5' size={25} 
                color={ (productResource.resourceType !== 'pending') ? 'blue': 'orange' }
                name={ (productResource.resourceType === 'internal') ? 'file-alt' : 'globe' } 
              />
              <ListItem.Content>
                <ListItem.Title style={{ fontWeight: 'bold' }}>
                  { productResource.resourceName }
                </ListItem.Title>
                <ListItem.Subtitle>{ productResource.description }</ListItem.Subtitle>
                <Text style={{ fontWeight: 'bold' }}>Publication Status: { productResource.publicationStatus }</Text>
              </ListItem.Content>
              { (productResource.link) && <ListItem.Chevron color='blue'/> }
            </ListItem>
          )
        }
        </ScrollView>
      </View>
    );
  }

  linkingProductResource(productResource) {
    console.log('linkingProductResource')
    if (productResource.link) {
      if (productResource.resourceType === 'external') {
        console.log('external product resource (show in browser): ' + productResource.link);
        Linking.canOpenURL(productResource.link).then( supported => {
          if (supported) {
            Linking.openURL(productResource.link);
          }
        })
      } else {
        console.log('internal product resource (show in WebView): ' + productResource.link);
        return true;  
      }
    }
    // if there is no link or we have displayed an external link in the browser, return false to short-circuit the logic
    return false;
  }
}

const mapStateToProps = (state, ownProps) => {

  var productMaster, productResourceList = [];

  // selected product nid
  const nid = ownProps.route.params.productMaster.nid;  //console.log('mapStateToProps ownProps', ownProps);

  // TODO: **** get bus req for both filters!
  // TODO: improve parsing

  // Product Master:
  const product = state.products.filter(item => {
    return item.nid == nid
      && item.language == state.settings.language
  })[0]; // expect 1 product

  // include derived props from component's ownProps 
  productMaster = {
    key: ownProps.route.params.productMaster.key, 
    nid: product.nid,
    link: ownProps.route.params.productMaster.link,
    brandName: product.brand_name, 
    ingredient: product.ingredient, 
    companyName: product.company_name, 
    type: ownProps.route.params.productMaster.type,
    status: product.status, 
    approvalDate: (typeof product.date_of_approval !== "undefined" && product.date_of_approval !== null)
      ? product.date_of_approval.match(/<time [^>]+>([^<]+)<\/time>/)[1]  // extract time text between > and <
      : "",
    searchKey: ownProps.route.params.productMaster.searchKey
  };
  productMaster.approvalDate = productMaster.approvalDate.substring(0, productMaster.approvalDate.indexOf(" - "));

  product.resources.forEach((resource, i) => {
    if (resource.audience.includes("Consumers")) {
      let isDescription = typeof resource.description !== "undefined" && resource.description !== null;
      let isResourceLinkAnAnchor = typeof resource.resource_link !== "undefined" && resource.resource_link !== null && resource.resource_link.indexOf("<a") > -1;
      var productResource = {
        key: i,
        id: resource.id,
        link: isResourceLinkAnAnchor ? resource.resource_link.match(/href="([^"]*)/)[1] : null,  // link or null (check to display right chevron errors if text)
        resourceType: "pending",
        audience: resource.audience.toString(),
        resourceName: isResourceLinkAnAnchor ? resource.resource_link.match(/<a [^>]+>([^<]+)<\/a>/)[1] : "",  // extract anchor text between > and <
        description: isDescription ? resource.description.replace(/(<([^>]+)>)/ig, "").trim() : "",  // strip html, trim
        publicationStatus: 
          resource.various_dates.toLowerCase() === "yes" 
            ? "Various" 
            : (typeof resource.date !== "undefined" && resource.date !== null)
              ? resource.date.match(/<time [^>]+>([^<]+)<\/time>/)[1]  // extract time text between > and <
              : "Pending"
      };
      if (!productResource.publicationStatus.includes("Various") && !productResource.publicationStatus.includes("Pending")) {
        productResource.publicationStatus = productResource.publicationStatus.substring(0, productResource.publicationStatus.indexOf(" - "));
      }

      // determine what type of resource this is:
      if (productResource.link) {

        // [pmh] this is a hack because I'm not sure why these don't render correctly
        if (productResource.link.includes("?linkID")) {  
          var fixedUrl = (state.settings.language === lang.english) ? covidVaccinePortal : portailVaccinCovid;
          fixedUrl += productResource.link;
          productResource.link = fixedUrl;
        }

        if (productResource.link.includes("http:") || productResource.link.includes("https:")) {
          productResource.resourceType = "external";
        } else {
          productResource.resourceType = "internal";
        }
      }

      productResourceList.push(productResource);
    }
  });

  //console.log('productMaster: ', productMaster);  //console.log('productResourceList', productResourceList);
  return {
    settings: state.settings,
    productMaster: productMaster,
    productResourceList: productResourceList
  };
};

export default connect(mapStateToProps)(ViewProductDetails);
