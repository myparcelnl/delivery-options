import {useCarrierSettings, useResolvedCarrier} from './index';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {CarrierName, type ShipmentOptionName} from '@myparcel/constants';
import {getResolvedCarrier} from '../utils';
import {mockSelectedDeliveryOptions} from '../__tests__/utils/mockSelectedDeliveryOptions';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {CarrierSetting, getShipmentOptionConfigMap, KEY_CONFIG} from '../../../../libs/shared/src';
import {useShipmentOptionsOptions} from './useShipmentOptionsOptions';

describe('useShipmentOptionsOptions', () => {
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
      mockSelectedDeliveryOptions();

      const result = useShipmentOptionsOptions();

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
      mockSelectedDeliveryOptions({
        deliveryMoment: {
          shipmentOptions: [
            {
              name: shipmentOption as ShipmentOptionName,
              schema: {type: 'boolean', enum: [false]},
            },
          ],
        },
      });

      const result = useShipmentOptionsOptions();

      const option = result.value.find((item) => item.value === shipmentOption);
      expect(option).toMatchObject({disabled: true, selected: false});
    },
  );

  it.each(Object.entries(getShipmentOptionConfigMap()))(
    'should set %s to selected and disabled based on enum',
    (shipmentOption, configKey) => {
      mockDeliveryOptionsConfig({[KEY_CONFIG]: {[configKey]: true}});
      mockSelectedDeliveryOptions({
        deliveryMoment: {
          shipmentOptions: [
            {
              name: shipmentOption as ShipmentOptionName,
              schema: {type: 'boolean', enum: [true]},
            },
          ],
        },
      });

      const result = useShipmentOptionsOptions();

      const option = result.value.find((item) => item.value === shipmentOption);
      expect(option).toMatchObject({disabled: true, selected: true});
    },
  );
});
