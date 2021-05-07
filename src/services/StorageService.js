import {KeyValueStore} from './KeyValueStore';

class StorageService {
  
  static instance;

  constructor () {
    if (!this.instance) {
      this.instance = this;
      this.keyValueStore = new KeyValueStore();
    }
    return this.instance;
  }

  save(key, value) {
    return this.keyValueStore.save(key, value);
  }

  retrieve(key) {
    return this.keyValueStore.retrieve(key);
  }

  delete(key) {
    return this.keyValueStore.delete(key);
  }

  retrieveKeys() {
    return this.keyValueStore.retrieveKeys();
  }

  saveMulti(keyValuePairs) {
    return this.keyValueStore.saveMulti(keyValuePairs);
  }

  retrieveMulti(keys) {
    return this.keyValueStore.retrieveMulti(keys);
  }

  deleteMulti(keys) {
    return this.keyValueStore.deleteMulti(keys);
  }

  deleteAll() {
    return this.keyValueStore.deleteAll();
  }

}

const storageService = new StorageService();

export default storageService;
