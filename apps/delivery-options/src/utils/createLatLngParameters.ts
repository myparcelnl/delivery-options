import {type EndpointParameters, type GetDeliveryOptions} from '@myparcel/sdk';
import {type LatLng} from '../types';

export const createLatLngParameters = <T extends LatLng>(
  latLng?: T,
): Pick<EndpointParameters<GetDeliveryOptions>, 'latitude' | 'longitude'> | undefined => {
  const latitude = latLng?.[0];
  const longitude = latLng?.[1];

  if (!latitude || !longitude) {
    return undefined;
  }

  return {
    latitude: String(latitude),
    longitude: String(longitude),
  };
};
