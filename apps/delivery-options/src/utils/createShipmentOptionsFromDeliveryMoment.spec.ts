import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {CarrierSetting, getShipmentOptionConfigMap, KEY_CONFIG} from '@myparcel-do/shared';
import {CarrierName, type ShipmentOptionName} from '@myparcel/constants';
import {useCarrierSettings, useResolvedCarrier} from '../composables';
import {mockDeliveryOptionsConfig, mockResolvedDeliveryOption} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';
import {createShipmentOptionsFromDeliveryMoment} from './createShipmentOptionsFromDeliveryMoment';

describe('createShipmentOptionsFromDeliveryMoment', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());

    useResolvedCarrier(CarrierName.PostNl);
    await flushPromises();
  });

  afterEach(() => {
    getResolvedCarrier.clear();
    useCarrierSettings.clear();
  });

  it.each(Object.entries(getShipmentOptionConfigMap()))(
    'should filter %s by whether it is enabled via the config',
    (shipmentOption, configKey) => {
      mockDeliveryOptionsConfig({
        [KEY_CONFIG]: {
          [CarrierSetting.AllowSignature]: true,
          [CarrierSetting.AllowOnlyRecipient]: true,
          [configKey]: false,
        },
      });

      const result = createShipmentOptionsFromDeliveryMoment(mockResolvedDeliveryOption());

      expect(result).toHaveLength(Object.keys(getShipmentOptionConfigMap()).length - 1);
      expect(result).not.toContainEqual({
        label: shipmentOption,
        value: shipmentOption,
        disabled: false,
        selected: false,
      });
    },
  );

  it.each(Object.entries(getShipmentOptionConfigMap()))(
    'should set %s to disabled based on enum',
    (shipmentOption, configKey) => {
      mockDeliveryOptionsConfig({[KEY_CONFIG]: {[configKey]: true}});

      const result = createShipmentOptionsFromDeliveryMoment(
        mockResolvedDeliveryOption({
          shipmentOptions: [
            {
              name: shipmentOption as ShipmentOptionName,
              schema: {type: 'boolean', enum: [false]},
            },
          ],
        }),
      );

      const option = result.find((item) => item.value === shipmentOption);
      expect(option).toMatchObject({disabled: true, selected: false});
    },
  );

  it.each(Object.entries(getShipmentOptionConfigMap()))(
    'should set %s to selected and disabled based on enum',
    (shipmentOption, configKey) => {
      mockDeliveryOptionsConfig({[KEY_CONFIG]: {[configKey]: true}});

      const result = createShipmentOptionsFromDeliveryMoment(
        mockResolvedDeliveryOption({
          shipmentOptions: [
            {
              name: shipmentOption as ShipmentOptionName,
              schema: {type: 'boolean', enum: [true]},
            },
          ],
        }),
      );

      const option = result.find((item) => item.value === shipmentOption);
      expect(option).toMatchObject({disabled: true, selected: true});
    },
  );
});
