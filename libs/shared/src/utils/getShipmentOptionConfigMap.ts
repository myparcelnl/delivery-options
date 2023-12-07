import {
  ALLOW_ONLY_RECIPIENT,
  ALLOW_SIGNATURE,
  type CarrierSetting,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';

export const getShipmentOptionConfigMap = (): Record<SupportedShipmentOptionName, CarrierSetting> => ({
  [ShipmentOptionName.Signature]: ALLOW_SIGNATURE,
  [ShipmentOptionName.OnlyRecipient]: ALLOW_ONLY_RECIPIENT,
});
