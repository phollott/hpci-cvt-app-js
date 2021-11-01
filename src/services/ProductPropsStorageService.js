/* eslint-disable no-console */
import StorageService from './StorageService';
import { productPropsKeyPrefix } from '../constants/constants';
import { getTimeInMillis } from '../shared/date-fns';
import { isNil, isObjectEmpty } from '../shared/util';

const productProps = (props) => {
  if (props && !isNil(props.id)) {
    return {
      id: props.id, // e.g. product nid
      viewed: !isNil(props.viewed) ? props.viewed : null // in millis
    };
  }
  return {};
};

const keyProductProps = async (props) => {
  return productPropsKeyPrefix.concat(props.id.toString());
};

const saveProductProps = async (props) => {
  const properties = productProps(props);
  if (!isObjectEmpty(properties)) {
    try {
      const key = await keyProductProps(properties);
      await StorageService.save(key, JSON.stringify(properties));
    } catch (error) {
      console.log('Unable to save product properties to storage. ', error);
    }
  }
};

const retrieveProductProps = async (id) => {
  let storedProps;
  let properties = {};
  try {
    storedProps = await StorageService.retrieve(await keyProductProps({ id }));
    if (!isNil(storedProps)) {
      properties = JSON.parse(storedProps);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Unable to retrieve product properties. ', error);
  }
  return properties;
};

const retrieveAllProductsProps = async () => {
  let keys = [];
  let storedProps = [];
  const properties = [];
  try {
    keys = await StorageService.retrieveKeys();
    if (keys.length > 0) {
      keys = keys.filter((key) => {
        return key.startsWith(productPropsKeyPrefix);
      });
      storedProps =
        keys !== null ? await StorageService.retrieveMulti(keys) : [];
      if (storedProps.length > 0) {
        storedProps.forEach((props) => {
          properties.push(JSON.parse(props[1]));
        });
      }
    }
  } catch (error) {
    console.log('retrieveAllProductProps error: ', error);
  }
  return properties;
};

const setViewed = async (id) => {
  let properties = {};
  if (!isNil(id)) {
    properties = await retrieveProductProps(id);
    if (isObjectEmpty(properties)) {
      properties = productProps({ id });
    }
    properties.viewed = getTimeInMillis();
    await saveProductProps(properties);
  }
  return properties;
};

export default {
  productProps,
  keyProductProps,
  saveProductProps,
  retrieveProductProps,
  retrieveAllProductsProps,
  setViewed
};
