import {type CarrierSetting, mapCarrierSettingToCapabilityKeys} from '@myparcel-dev/do-shared';
import {useSandboxCapabilities} from '../composables';

/**
 * Check if a given carrier setting is supported by the carrier's capabilities.
 * Settings without a capability mapping (e.g. prices, dropoff config) are always
 * shown. Settings with multiple capability representations (e.g. same-day, which
 * is a delivery type on some carriers and an option on others) are shown when
 * any representation matches.
 */
export const availableInCarrier = (fieldPath: string): boolean => {
  const parts = fieldPath.split('.');
  const carrierName = parts[0];
  const settingKey = parts[1] as CarrierSetting;

  if (!carrierName) {
    return true;
  }

  const capMappings = mapCarrierSettingToCapabilityKeys(settingKey);

  if (capMappings.length === 0) {
    return true;
  }

  const {getCarrierCapability} = useSandboxCapabilities();
  const cap = getCarrierCapability(carrierName);

  if (!cap) {
    return true;
  }

  return capMappings.some((capMapping) =>
    capMapping.type === 'deliveryType' ? cap.deliveryTypes.includes(capMapping.name) : capMapping.name in cap.options,
  );
};
