import {ShipmentOptionName} from '@myparcel/constants';
import {type SupportedShipmentOptionName} from '../types';
import {type CarrierSetting} from '../enums';
import {ALLOW_ONLY_RECIPIENT, ALLOW_SIGNATURE} from '../data';

export const getShipmentOptionConfigMap = (): Record<SupportedShipmentOptionName, CarrierSetting> => ({
  [ShipmentOptionName.Signature]: ALLOW_SIGNATURE,
  [ShipmentOptionName.OnlyRecipient]: ALLOW_ONLY_RECIPIENT,
});
