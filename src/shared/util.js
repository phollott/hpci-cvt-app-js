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

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const waitUntil = async (condf, timeout) => {
  return new Promise((resolve, reject) => {
    const start = getDate();
    const interval = setInterval(() => {
      if (condf()) {
        // console.log('resolved after', getDate() - start, 'ms');
        clearInterval(interval);
        resolve();
      } else if (getDate() - start > timeout) {
        // timeout
        // console.log('rejected after', getDate() - start, 'ms');
        clearInterval(interval);
        reject();
      }
    }, 100);
  });
};

export { isNil, isObjectEmpty, wait, waitUntil };
