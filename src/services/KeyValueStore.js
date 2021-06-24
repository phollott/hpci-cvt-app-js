import AsyncStorage from '@react-native-async-storage/async-storage'; // asynchronous, unencrypted, persistent, key-value storage system for RN

export class KeyValueStore {
  save(key, value) {
    return AsyncStorage.setItem(key, value);
  }

  retrieve(key) {
    return AsyncStorage.getItem(key);
  }

  delete(key) {
    return AsyncStorage.removeItem(key);
  }

  retrieveKeys() {
    return AsyncStorage.getAllKeys();
  }

  // keyValuePairs ex: [['key1','value1'],['key2','value2']]
  saveMulti(keyValuePairs) {
    return AsyncStorage.multiSet(keyValuePairs);
  }

  // keys ex: ['key1','key2']
  // returns key value pairs
  retrieveMulti(keys) {
    return AsyncStorage.multiGet(keys);
  }

  deleteMulti(keys) {
    return AsyncStorage.multiRemove(keys);
  }

  deleteAll() {
    return AsyncStorage.clear();
  }
}
