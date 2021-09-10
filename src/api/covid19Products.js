import { encode } from 'base-64';
import { CVT_API_USERNAME, CVT_API_PASSWORD } from 'react-native-dotenv';
import { vaccineAPIUrl } from '../config/routes';

const username = CVT_API_USERNAME;
const password = CVT_API_PASSWORD;

// eslint-disable-next-line no-undef
const headers = new Headers();
headers.append(
  'Authorization',
  'Basic '.concat(encode(username.concat(':').concat(password)))
);
headers.append('Accept', 'application/json');
headers.append('Content-Type', 'application/json');

const fetchProductsAsync = async () => {
  try {
    const requestInit = {
      method: 'GET',
      headers
    };
    const response = await fetch(vaccineAPIUrl, requestInit);
    const responseJson = await response.json();
    if (response.status !== 200) {
      throw Error(responseJson.message);
    }
    return responseJson;
  } catch (error) {
    throw Error(error.message);
  }
};

// TODO: fetchProductNewsAsync

export { fetchProductsAsync };
