import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import cheerio from 'react-native-cheerio';

export default class ViewProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productMaster: {
        brandName: null, companyName: null, 
        ingredient: null, status: null, approvalDate: null
      },
      productResourceList: [],
//      productMasterHtml: 'none',
//      productResourceHtml: 'none'
    };
  }

  /*************************************************************************************
   * 1. Determine the appropriate url to use to load Product Detail data (EN/FR)
   * 2. Fetch an HTML Page and load it into Cheerio
   * 3. Extract Product Master and Product Resource details
   * 4. Add Approved and Applied Product Masters to Component State
   * [pmh] we have the Product Master from the previous screen, but reload it anyway 
   */

  componentDidMount() {
    var productMasterIn = this.props.route.params.productMaster,
      url = (global.language === 'en-ca') ? "https://covid-vaccine.canada.ca" : "https://vaccin-covid.canada.ca";
    url += productMasterIn.link;

    fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 
      var $ = cheerio.load(text),
        prodMasterBlock = $('section.block-views-blockvaccine-information-revisions-block-1'),
        prodResourceBlock = $('section.block-views-blockvaccine-resources-revisions-block-1')

      var productMaster = this.scrapeProductMaster($, prodMasterBlock);
      var productResourceList = this.scrapeProductResources($, prodResourceBlock);

      this.setState({
        productMaster: productMaster,
        productResourceList: productResourceList,
//        productMasterHtml: prodMasterBlock.html(),
//        productResourceHtml: prodResourceBlock.html()
      });
    }).catch(error => {
      console.log('VPD: could not load url ' + url);
    });      
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <Card style={{ flex: 1 }}>
          <Card.Title>Product Description</Card.Title>
          <Text><Text style={{ fontWeight: 'bold' }}>Brand Name: </Text>{this.state.productMaster.brandName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Company Name: </Text>{this.state.productMaster.companyName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Ingredient: </Text>{this.state.productMaster.ingredient}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status: </Text>{this.state.productMaster.status}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Date of approval: </Text>{this.state.productMaster.approvalDate}</Text>
        </Card>

        <ScrollView>
        {
          this.state.productResourceList.map( productResource =>
            <ListItem key={productResource.key} bottomDivider
              onPress={() => (productResource.link) &&
                this.props.navigation.navigate('ProductResource', { productResource })}
            >
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

/*
      <View style={{ flex: 1 }} >
        <Card style={{ flex: 1 }}>
          <Card.Title>Product Description</Card.Title>
          <Text><Text style={{ fontWeight: 'bold' }}>Brand Name: </Text>{this.state.productMaster.brandName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Company Name: </Text>{this.state.productMaster.companyName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Ingredient: </Text>{this.state.productMaster.ingredient}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status: </Text>{this.state.productMaster.status}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Date of approval: </Text>{this.state.productMaster.approvalDate}</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Card.Title>Product Resources</Card.Title>
          <ScrollView>
          {
            this.state.productResourceList.map( productResource =>
              <ListItem key={productResource.key} bottomDivider
                onPress={() => (productResource.link) &&
                  this.props.navigation.navigate('ProductResource', { productResource })}
              >
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: 'bold' }}>
                    { productResource.resourceName }
                  </ListItem.Title>
                  <ListItem.Subtitle>{ productResource.description }</ListItem.Subtitle>
                  <Text style={{ fontWeight: 'bold' }}>Publication Status: { productResource.publicationStatus }</Text>
                </ListItem.Content>
                { (productResource.link) && <ListItem.Chevron/> }
              </ListItem>
            )
          }
          </ScrollView>
        </Card>
      </View>

*/
  /* 
   * Scrape the appropriate divs, skipping revision id for each field.
   * There is a more sophisticated way to do this, but this works for now.
   */
  scrapeProductMaster($, prodMasterBlock) {
    var productMaster = {
      brandName: null, companyName: null, ingredient: null, status: null, approvalDate: null
    };

    var viewRows = prodMasterBlock.find('div.views-row').find('div');
    viewRows.each((i, div) => {
      switch (i) {
        case 2: productMaster.brandName = $(div).text().trim(); break;
        case 5: productMaster.companyName = $(div).text().trim(); break;
        case 8: productMaster.ingredient = $(div).text().trim(); break;
        case 11: productMaster.status = $(div).text().trim(); break;
        case 14: productMaster.approvalDate = $(div).text().trim(); break;
      }
    });
    console.log(productMaster);
    return productMaster;
  }

  scrapeProductResources($, prodResourceBlock) {
    var productResourceList = [];

    var resourceRows = prodResourceBlock.find('tr');
    resourceRows.each((i, tr) => {
      if (i===0) {
        // this is the header row - ignore it
      } else {
        var audience = $(tr).find('td').eq(1).text();
        if (audience.includes('Consumers')) {
          productResourceList.push({
            key: i,
            link: $(tr).find('td').eq(2).find('a').attr('href'),
            audience: $(tr).find('td').eq(1).text().trim(),
            resourceName: $(tr).find('td').eq(2).text().trim(),
            description: $(tr).find('td').eq(3).text().trim(),
            publicationStatus: $(tr).find('td').eq(4).text().trim(),
            revised: $(tr).find('td').eq(0).text().trim()
          });
        }
      }
      console.log(productResourceList);
    });

    return productResourceList;
  }

}