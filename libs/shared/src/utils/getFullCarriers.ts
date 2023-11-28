import {type CarrierIdentifier, type FullCarrier} from '../types';
import {useCurrentPlatform} from '../composables';
import {getFullCarrier} from './getFullCarrier';

export const getFullCarriers = (carriers: CarrierIdentifier[]): Promise<FullCarrier[]> => {
  const platform = useCurrentPlatform();

  return Promise.all(carriers.map((carrier) => getFullCarrier(carrier, platform.name.value)));
};
