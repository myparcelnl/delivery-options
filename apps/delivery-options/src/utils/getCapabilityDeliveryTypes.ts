import {
  type CarrierCapability,
  type SupportedDeliveryTypeName,
  mapCapabilityDeliveryType,
  mapCapabilityOptionToCustomDeliveryType,
} from '@myparcel-dev/do-shared';

/**
 * Extracts all delivery types available for a carrier from its capabilities,
 * including standard delivery types and custom types (same-day, Monday,
 * Saturday) derived from capability options.
 */
export const getCapabilityDeliveryTypes = (cap: CarrierCapability): SupportedDeliveryTypeName[] => {
  const mapped = cap.deliveryTypes
    .map(mapCapabilityDeliveryType)
    .filter((dt): dt is SupportedDeliveryTypeName => dt !== undefined);

  for (const optionName of Object.keys(cap.options)) {
    const customType = mapCapabilityOptionToCustomDeliveryType(optionName);

    if (customType) {
      mapped.push(customType);
    }
  }

  return mapped;
};
