import * as React from 'react';
import { isNil, waitUntil } from '../shared/util';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export async function navigate(name, params) {
  let isMounted = false;
  if (isReadyRef.current && navigationRef.current) {
    // navigate if the app has mounted
    isMounted = true;
    navigationRef.current.navigate(name, params);
  } else {
    // wait until the app has mounted, but give up after 5s
    await waitUntil(() => isReadyRef.current && navigationRef.current, 5000);
    isMounted = !isNil(isReadyRef.current) && !isNil(navigationRef.current);
    navigationRef.current?.navigate(name, params);
  }
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    resolve(isMounted);
  });
}
