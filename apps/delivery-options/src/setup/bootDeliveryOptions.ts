import {showDeveloperInfo} from '../utils';
import {UPDATE_DELIVERY_OPTIONS, RENDER_DELIVERY_OPTIONS} from '../data';
import {initializeApp} from './initializeApp';

export const bootDeliveryOptions = (): void => {
  if (import.meta.env.DEV && !window.hasOwnProperty('MyParcelConfig')) {
    window.onload = showDeveloperInfo;
  }

  document.addEventListener(RENDER_DELIVERY_OPTIONS, initializeApp);
  document.addEventListener(UPDATE_DELIVERY_OPTIONS, initializeApp);
};
