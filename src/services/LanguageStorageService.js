import StorageService from './StorageService';
import { languageKeyPrefix } from '../constants/constants';

const retrieveLanguage = async () => {
  try {
    const value = await StorageService.retrieve(languageKeyPrefix);
    return value;
  } catch (error) {
    return null;
  }
};

const saveLanguage = async (value) => {
  await StorageService.save(languageKeyPrefix, value);
};

export default {
  retrieveLanguage,
  saveLanguage
};
