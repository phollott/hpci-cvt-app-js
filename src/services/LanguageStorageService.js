import StorageService from './StorageService';

const retrieveLanguage = async () => {
  try {
    const value = await StorageService.retrieve('language');
    return value;
  } catch (error) {
    return null;
  }
};

const saveLanguage = async (value) => {
  await StorageService.save('language', value);
};

export default {
  retrieveLanguage,
  saveLanguage
};
