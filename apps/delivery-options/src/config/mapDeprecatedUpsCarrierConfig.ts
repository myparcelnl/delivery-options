import type {InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';

// This function maps deprecated UPS carrier settings to the new UPS Standard settings.
export const mapDeprecatedUpsCarrierConfig = (
  input: InputDeliveryOptionsConfiguration,
): InputDeliveryOptionsConfiguration => {
  if (!input.config?.carrierSettings || !input.config?.carrierSettings.ups) {
    return input;
  }

  if (input.config.carrierSettings.ups && input.config.carrierSettings.upsstandard) {
    throw new Error(
      'Both ups and upsstandard carrier settings are defined. Ups settings are deprecated and should not be used.',
    );
  }

  console.warn(
    `The ${CarrierName.Ups} carrier settings are deprecated. settings are mapped to ${CarrierName.UpsStandard}`,
  );
  input.config.carrierSettings.upsstandard = input.config.carrierSettings.ups;
  delete input.config.carrierSettings.ups;
  return input;
};
