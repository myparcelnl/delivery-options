import {
  type CarrierCapability,
  type SupportedDeliveryTypeName,
  mapCapabilityDeliveryType,
  mapCapabilityOptionToCustomDeliveryType,
} from '@myparcel-dev/do-shared';

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
