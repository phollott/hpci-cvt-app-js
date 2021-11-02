/* eslint-disable no-console */
import { getDate } from './date-fns';

const isNil = (value) => {
  return typeof value === 'undefined' || value === null;
};

const isObjectEmpty = (obj) => {
  return (
    !isNil(obj) && Object.keys(obj).length === 0 && obj.constructor === Object
  );
};

const waitUntil = async (condf, timeout) => {
  return new Promise((resolve, reject) => {
    const start = getDate();
    const wait = setInterval(() => {
      if (condf()) {
        // console.log('resolved after', getDate() - start, 'ms');
        clearInterval(wait);
        resolve();
      } else if (getDate() - start > timeout) {
        // timeout
        // console.log('rejected after', getDate() - start, 'ms');
        clearInterval(wait);
        reject();
      }
    }, 100);
  });
};

export { isNil, isObjectEmpty, waitUntil };
