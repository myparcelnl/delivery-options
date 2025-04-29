import {toValue} from 'vue';
import {type SupportedPackageTypeName} from '@myparcel-do/shared';
import {CarrierSetting} from '@myparcel-do/shared';
import {ShipmentOptionName} from '@myparcel/constants';
import {type UseResolvedCarrier} from './useResolvedCarrier';

export interface ShipmentOption {
  name: ShipmentOptionName;
  schema: {
    enum: boolean[];
    default: boolean;
    type: 'boolean';
  };
}

/**
 * Create fake shipment options based on carrier configuration
 */
export const createFakeShipmentOptions = (
  carrier: UseResolvedCarrier,
  packageType: SupportedPackageTypeName,
): ShipmentOption[] => {
  const features = toValue(carrier.features);
  const shipmentOptions: ShipmentOption[] = [];
  const shipmentOptionsPerPackageType = toValue(carrier.shipmentOptionsPerPackageType);
  const packageTypeOptions = shipmentOptionsPerPackageType[packageType];

  // Only include options supported for this package type
  if (!packageTypeOptions) {
    return [];
  }

  // Add signature option if supported
  if (packageTypeOptions.has(ShipmentOptionName.Signature) && features.has(CarrierSetting.AllowSignature)) {
    shipmentOptions.push({
      name: ShipmentOptionName.Signature,
      schema: {
        enum: [false, true],
        default: false,
        type: 'boolean',
      },
    });
  }

  // Add only_recipient option if supported
  if (packageTypeOptions.has(ShipmentOptionName.OnlyRecipient) && features.has(CarrierSetting.AllowOnlyRecipient)) {
    shipmentOptions.push({
      name: ShipmentOptionName.OnlyRecipient,
      schema: {
        enum: [false, true],
        default: false,
        type: 'boolean',
      },
    });
  }

  return shipmentOptions;
};
