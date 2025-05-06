import {toValue} from 'vue';
import {CarrierSetting, type SupportedPackageTypeName} from '@myparcel-do/shared';
import {type PossibleShipmentOption} from '@myparcel/sdk';
import {ShipmentOptionName} from '@myparcel/constants';
import {type UseResolvedCarrier} from './useResolvedCarrier';

/**
 * Create fake shipment options based on carrier configuration
 */
export const createFakeShipmentOptions = (
  carrier: UseResolvedCarrier,
  packageType: SupportedPackageTypeName,
): PossibleShipmentOption[] => {
  const features = toValue(carrier.features);
  const shipmentOptions: PossibleShipmentOption[] = [];
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
