import {ShipmentOptionName} from '@myparcel/constants';
import {type SupportedShipmentOptionName} from '../types';
import {CarrierSetting} from '../enums';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getShipmentOptionConfigMap = () => {
  return {
    [ShipmentOptionName.Signature]: CarrierSetting.AllowSignature,
    [ShipmentOptionName.OnlyRecipient]: CarrierSetting.AllowOnlyRecipient,
  } satisfies Record<SupportedShipmentOptionName, CarrierSetting>;
};
