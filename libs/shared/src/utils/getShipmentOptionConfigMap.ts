import {ShipmentOptionName} from '@myparcel-dev/constants';
import {type SupportedShipmentOptionName} from '../types';
import {CarrierSetting} from '../data';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getShipmentOptionConfigMap = (): Record<SupportedShipmentOptionName, CarrierSetting> => {
  return {
    [ShipmentOptionName.PriorityDelivery]: CarrierSetting.AllowPriorityDelivery,
    [ShipmentOptionName.Signature]: CarrierSetting.AllowSignature,
    [ShipmentOptionName.OnlyRecipient]: CarrierSetting.AllowOnlyRecipient,
  };
};
