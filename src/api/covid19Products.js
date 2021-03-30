import { route } from '../constants';

export const fetchProductsAsync = async () => {
  try {
    let response = await fetch(route.vaccineAPI1Url);
    let responseJson = await response.json();
    if (response.status !== 200) {
        throw Error(responseJson.message);
    }
    return responseJson;
  }
  catch (error) {
    throw Error(error.message);
  }
};
