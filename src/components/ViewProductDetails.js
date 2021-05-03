import React, { Component } from 'react';
import { Text, View, ScrollView, Linking, StyleSheet } from 'react-native';
import { Card, ListItem, Badge } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { connect } from 'react-redux';
import { t } from 'i18n-js';
import { selectProductByID } from '../redux/selectors/productSelector';
import cheerio from 'react-native-cheerio';
import Icon from './Icon';
import { lang, covidVaccinePortal, portailVaccinCovid } from '../constants/constants';

import { productResource } from '../services';

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
      <View style={{ flex: 1 }}>
        <Card style={{ flex: 1 }}>
          <Card.Title style={{ marginBottom: 8 }}>{this.props.productMaster.brandName}</Card.Title>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.companyNameLabel') }</Text>{this.props.productMaster.companyName}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.ingredientLabel') }</Text>{this.props.productMaster.ingredient}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.statusLabel') }</Text>{this.props.productMaster.status}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>{ t('productDetails.card.approvalDateLabel') }</Text>{this.props.productMaster.approvalDate}</Text>
        </Card>
        <ScrollView style={{ backgroundColor: 'white' }}>
        { this.state.tableData[0][0] != "..." &&
          <Table borderStyle={{borderWidth: 1, borderColor: '#97B7D2'}}>
            <Row data={this.state.tableHead} flexArr={[1, 2, 2, 2]} style={styles.head} textStyle={styles.headText}/>
            <TableWrapper style={styles.wrapper}>
              <Rows data={this.state.tableData} flexArr={[1, 2, 2, 2]} textStyle={styles.text}/>
            </TableWrapper>
          </Table>
        }
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
                { productResource.isNew && <Badge value={'New'} status='success' containerStyle={{ marginLeft: -42, marginTop: -20 }} /> }
                { productResource.isUpdated && <Badge value={'Update'} status='warning' containerStyle={{ marginLeft: -50, marginTop: -20 }} /> }
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
  var productMaster, productResourceList = [];
  
  // Product Master:
  productMaster = ownProps.route.params.productMaster;

  // Product Resources:
  const product = selectProductByID(state, ownProps.route.params.productMaster.nid);
  productResourceList.push(...productResource.mapProductResources(product, state.settings.language));

  return {
    settings: state.settings,
    productMaster: productMaster,
    productResourceList: productResourceList
  };
};

export default connect(mapStateToProps)(ViewProductDetails);
