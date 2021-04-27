import React, { Component } from 'react';
import { Text, View, ScrollView, Linking, StyleSheet } from 'react-native';
import { Card, ListItem, Badge } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';
import { selectProductByID } from '../redux/selectors/productSelector';
import cheerio from 'react-native-cheerio';
import Icon from './Icon';

class ViewProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: [t('productDetails.tableHead.din'), t('productDetails.tableHead.strength'), t('productDetails.tableHead.dosageForm'), t('productDetails.tableHead.administrationRoute')],
      tableLeft: ['...'],
      tableData: [ ['...', '...', '...', '...'] ]
    }
  }

  /*************************************************************************************
   * 1. Extract from redux store Product Master and Product Resource details
   * 
   * [pmh] we have the Product Master from the previous screen, but reload it anyway 
   * [pmh] Table styles should live with the other global styles
   */

  componentDidMount() {
    this.props.productResourceList.forEach((resource, i) => {
      if (resource.resourceName === 'Consumer Information' || resource.resourceName.toLowerCase().includes('consommateurs')) {
        const cvtPortal = (this.props.settings.language === lang.english) ? covidVaccinePortal : portailVaccinCovid;
        var url = cvtPortal + resource.link;            
        fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ 
          var $ = cheerio.load(text), tableData = [];
          $('tbody').first().find('tr').map((i, row) => {
            var tableCells = [];
            $(row).find('td').map((j, div) => {
              switch (j) {
                case 0: case 3: case 4: case 5: 
                  tableCells.push($(div).text().trim()); break;
              }
            });
            tableData.push(tableCells);
          });
          this.setState({
            tableHead: [t('productDetails.tableHead.din'), t('productDetails.tableHead.strength'), t('productDetails.tableHead.dosageForm'), t('productDetails.tableHead.administrationRoute')],      
            tableData: tableData
          });
        });
      }
    });      
  }

  render() {
    const styles = StyleSheet.create({
      container: { flex: 1, padding: 4, backgroundColor: '#fff' },
      head: { height: 20, backgroundColor: '#2289DC' },
      wrapper: { flexDirection: 'row'},
      headText: { margin: 4, fontSize: 8, fontWeight: 'bold', color: 'white' },
      text: { margin: 4, fontSize: 9 }      
    });
    return (
      <View style={{ flex: 1 }} >
        <Card style={{ flex: 1 }}>
          <Card.Title style={{ marginBottom: 8 }}>{this.props.productMaster.brandName}</Card.Title>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.companyNameLabel') }</Text>{this.props.productMaster.companyName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.ingredientLabel') }</Text>{this.props.productMaster.ingredient}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.statusLabel') }</Text>{this.props.productMaster.status}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.approvalDateLabel') }</Text>{this.props.productMaster.approvalDate}</Text>
        </Card>
        <ScrollView style={{ backgroundColor: 'white' }}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#97B7D2'}}>
            <Row data={this.state.tableHead} flexArr={[1, 2, 2, 2]} style={styles.head} textStyle={styles.headText}/>
            <TableWrapper style={styles.wrapper}>
              <Rows data={this.state.tableData} flexArr={[1, 2, 2, 2]} textStyle={styles.text}/>
            </TableWrapper>
          </Table>
        {
          this.props.productResourceList.map( productResource =>
            <ListItem key={productResource.key} bottomDivider
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
                </ListItem.Title>
                { (false) && <Badge value={'New'} status='success' containerStyle={{ marginLeft: -42, marginTop: -20 }} /> }
                { (false) && <Badge value={'Update'} status='warning' containerStyle={{ marginLeft: -50, marginTop: -20 }} /> }
                <ListItem.Subtitle>{ productResource.description }</ListItem.Subtitle>
                <Text style={{ fontWeight: 'bold' }}>{ t('productDetails.listItem.publicationStatusLabel') }{ productResource.publicationStatus }</Text>
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
  
  // Product Master:
  const product = selectProductByID(state, ownProps.route.params.productMaster.nid);

  // include derived props from component's ownProps 
  productMaster = {
    key: ownProps.route.params.productMaster.key, 
    nid: product.nid,
    link: ownProps.route.params.productMaster.link,
    title: product.title,
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
  if (productMaster.approvalDate.indexOf(",") > -1) {
    productMaster.approvalDate = productMaster.approvalDate.substring(productMaster.approvalDate.indexOf(",") + 1).trim();
  }

  product.resources.forEach((resource, i) => {
    if (resource.audience.includes("Consumers")) {  // TODO: review... if ever french, may need to check for consommateurs
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
            ? t('productDetails.listItem.publicationStatus.various') 
            : (typeof resource.date !== "undefined" && resource.date !== null)
              ? resource.date.match(/<time [^>]+>([^<]+)<\/time>/)[1]  // extract time text between > and <
              : t('productDetails.listItem.publicationStatus.pending') 
      };
      if (!productResource.publicationStatus.includes( t('productDetails.listItem.publicationStatus.various') ) 
        && !productResource.publicationStatus.includes( t('productDetails.listItem.publicationStatus.pending') )
      ){
        productResource.publicationStatus = productResource.publicationStatus.substring(0, productResource.publicationStatus.indexOf(" - "));
        if (productResource.publicationStatus.indexOf(",") > -1) {
          productResource.publicationStatus = productResource.publicationStatus.substring(productResource.publicationStatus.indexOf(",") + 1).trim();
        }
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
