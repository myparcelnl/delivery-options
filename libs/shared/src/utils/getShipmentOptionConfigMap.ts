import {ShipmentOptionName} from '@myparcel/constants';
import {type SupportedShipmentOptionName} from '../types';
import {CarrierSetting} from '../data';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getShipmentOptionConfigMap = (): Record<SupportedShipmentOptionName, CarrierSetting> => {
  return {
    [ShipmentOptionName.Signature]: CarrierSetting.AllowSignature,
    [ShipmentOptionName.OnlyRecipient]: CarrierSetting.AllowOnlyRecipient,
  };
};
