import {type Carrier} from '@myparcel/sdk';
import {type CarrierNameOrId} from '@myparcel/constants';
import {
  CARRIER_BOL,
  CARRIER_BPOST,
  CARRIER_CHEAP_CARGO,
  CARRIER_DHL,
  CARRIER_DHL_EURO_PLUS,
  CARRIER_DHL_FOR_YOU,
  CARRIER_DHL_PARCEL_CONNECT,
  CARRIER_DPD,
  CARRIER_INSTABOX,
  CARRIER_POST_NL,
  CARRIER_UPS_STANDARD,
  CARRIER_UPS_EXPRESS_SAVER,
} from '../carriers';

const allCarrierData = [
  CARRIER_POST_NL,
  CARRIER_BPOST,
  CARRIER_CHEAP_CARGO,
  CARRIER_DPD,
  CARRIER_DHL,
  // CARRIER_UPS,
  CARRIER_UPS_STANDARD,
  CARRIER_UPS_EXPRESS_SAVER,
  CARRIER_BOL,
  CARRIER_INSTABOX,
  CARRIER_DHL_FOR_YOU,
  CARRIER_DHL_PARCEL_CONNECT,
  CARRIER_DHL_EURO_PLUS,
] satisfies Carrier[];

export const fakeCarriersResponse = (carrier?: CarrierNameOrId): Carrier[] => {
  if (!carrier) {
    return allCarrierData;
  }

  const found = allCarrierData.find(({name, id}) => name === carrier || id === carrier);

  if (!found) {
    throw new Error(`Carrier ${carrier} not found`);
  }

  return [found];
};
