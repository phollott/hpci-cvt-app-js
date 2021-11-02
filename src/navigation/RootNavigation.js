import * as React from 'react';
import { waitUntil } from '../shared/util';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export async function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // navigate if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // wait until the app has mounted, but give up after 5s
    await waitUntil(() => isReadyRef.current && navigationRef.current, 5000);
    navigationRef.current?.navigate(name, params);
  }
}
