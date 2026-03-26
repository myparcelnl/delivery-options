import {type CarrierSetting, mapCarrierSettingToCapabilityKey} from '@myparcel-dev/do-shared';
import {useSandboxCapabilities} from '../composables';

/**
 * Check if a given carrier setting is supported by the carrier's capabilities.
 * Settings without a capability mapping (e.g. prices, dropoff config) are always shown.
 */
export const availableInCarrier = (fieldPath: string): boolean => {
  const parts = fieldPath.split('.');
  const carrierName = parts[0];
  const settingKey = parts[1] as CarrierSetting;

  const capMapping = mapCarrierSettingToCapabilityKey(settingKey);

  if (!capMapping) {
    return true;
  }

  const {getCarrierCapability} = useSandboxCapabilities();
  const cap = getCarrierCapability(carrierName);

  if (!cap) {
    return true;
  }

  if (capMapping.type === 'deliveryType') {
    return cap.deliveryTypes.includes(capMapping.name);
  }

  return capMapping.name in cap.options;
};
