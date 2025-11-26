import type {InputDeliveryOptionsConfiguration} from '@myparcel-dev/shared';
import {CarrierName} from '@myparcel-dev/constants';

// This function maps deprecated UPS carrier settings to the new UPS Standard settings.
export const mapDeprecatedUpsCarrierConfig = (
  input: InputDeliveryOptionsConfiguration,
): InputDeliveryOptionsConfiguration => {
  // If there are no UPS settings defined, return the input as is.
  if (!input.config?.carrierSettings || !input.config?.carrierSettings.ups) {
    return input;
  }

  // If both ups and upsstandard or upsexpresssaver are defined, throw an error.
  if (
    (input.config.carrierSettings.ups && input.config.carrierSettings.upsstandard) ||
    (input.config.carrierSettings.ups && input.config.carrierSettings.upsexpresssaver)
  ) {
    throw new Error(
      'Both ups and upsstandard or upsexpresssaver carrier settings are defined. Ups settings are deprecated and should not be used.',
    );
  }

  console.warn(
    `The ${CarrierName.Ups} carrier settings are deprecated. settings are mapped to ${CarrierName.UpsStandard}`,
  );

  switch (input.config.carrierSettings.ups !== null) {
    // If both standard and express delivery are allowed, split them into separate settings.
    case input.config.carrierSettings.ups.allowStandardDelivery &&
      input.config.carrierSettings.ups.allowExpressDelivery:
      input.config.carrierSettings.upsstandard = {...input.config.carrierSettings.ups, allowExpressDelivery: false};
      input.config.carrierSettings.upsexpresssaver = {
        ...input.config.carrierSettings.ups,
        allowStandardDelivery: false,
      };
      break;
    // If only standard delivery is allowed, map it to upsstandard.
    case input.config.carrierSettings.ups.allowStandardDelivery:
      input.config.carrierSettings.upsstandard = input.config.carrierSettings.ups;
      break;
    // If only express delivery is allowed, map it to upsexpresssaver.
    case input.config.carrierSettings.ups.allowExpressDelivery:
      input.config.carrierSettings.upsexpresssaver = input.config.carrierSettings.ups;
      break;
  }

  delete input.config.carrierSettings.ups;
  return input;
};
