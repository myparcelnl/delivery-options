import {type CarrierSetting, mapCarrierSettingToCapabilityKeys} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useSandboxCapabilities} from '../composables';

/**
 * Monday delivery is a delivery_options query parameter, not a carrier
 * capability, so the capabilities response cannot tell us which carriers support
 * it. Keep an explicit list here so the sandbox only offers the toggle where it
 * actually does something.
 */
const EXTRA_DELIVERY_DAY_CARRIERS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  mondayDelivery: [CarrierName.PostNl],
});

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

  return capMappings.some((capMapping) => {
    if (capMapping.type === 'deliveryType') {
      return cap.deliveryTypes.includes(capMapping.name);
    }

    const supportedCarriers = EXTRA_DELIVERY_DAY_CARRIERS[capMapping.name];

    if (supportedCarriers) {
      return supportedCarriers.includes(carrierName);
    }

    return capMapping.name in cap.options;
  });
};
