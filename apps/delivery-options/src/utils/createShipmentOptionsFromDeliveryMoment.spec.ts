import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {mockDeliveryOptionsConfig} from '@myparcel-do/shared/testing';
import {ALLOW_ONLY_RECIPIENT, ALLOW_SIGNATURE, KEY_CONFIG, useCarrierSettings} from '@myparcel-do/shared';
import {type ShipmentOptionName} from '@myparcel/constants';
import {SHIPMENT_OPTION_CONFIG_MAP} from '../constants';
import {mockDeliveryOption} from '../__tests__/utils/mockDeliveryOption';
import {createShipmentOptionsFromDeliveryMoment} from './createShipmentOptionsFromDeliveryMoment';

describe('createShipmentOptionsFromDeliveryMoment', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    useCarrierSettings.clear();
  });

  it.each(Object.entries(SHIPMENT_OPTION_CONFIG_MAP))(
    'should filter %s by whether it is enabled via the config',
    (shipmentOption, configKey) => {
      mockDeliveryOptionsConfig({
        [KEY_CONFIG]: {
          [ALLOW_SIGNATURE]: true,
          [ALLOW_ONLY_RECIPIENT]: true,
          [configKey]: false,
        },
      });

      const result = createShipmentOptionsFromDeliveryMoment(mockDeliveryOption());

      expect(result).toHaveLength(Object.keys(SHIPMENT_OPTION_CONFIG_MAP).length - 1);
      expect(result).not.toContainEqual({
        label: shipmentOption,
        value: shipmentOption,
        disabled: false,
        selected: false,
      });
    },
  );

  it.each(Object.entries(SHIPMENT_OPTION_CONFIG_MAP))(
    'should set %s to disabled based on delivery options',
    (shipmentOption, configKey) => {
      mockDeliveryOptionsConfig({
        [KEY_CONFIG]: {
          [configKey]: true,
        },
      });

      const result = createShipmentOptionsFromDeliveryMoment(
        mockDeliveryOption({
          shipmentOptions: [
            {
              name: shipmentOption as ShipmentOptionName,
              schema: {
                type: 'boolean',
                enum: [false],
              },
            },
          ],
        }),
      );

      expect(result).toContainEqual({
        label: shipmentOption,
        value: shipmentOption,
        disabled: true,
        selected: false,
      });
    },
  );

  it.each(Object.entries(SHIPMENT_OPTION_CONFIG_MAP))(
    'should set %s to selected and disabled based on delivery options',
    (shipmentOption, configKey) => {
      mockDeliveryOptionsConfig({
        [KEY_CONFIG]: {
          [configKey]: true,
        },
      });

      const result = createShipmentOptionsFromDeliveryMoment(
        mockDeliveryOption({
          shipmentOptions: [
            {
              name: shipmentOption as ShipmentOptionName,
              schema: {
                type: 'boolean',
                enum: [true],
              },
            },
          ],
        }),
      );

      expect(result).toContainEqual({
        label: shipmentOption,
        value: shipmentOption,
        disabled: true,
        selected: true,
      });
    },
  );
});
