import {describe, expect, it} from 'vitest';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getDeliveryTypeConfigMap} from './getDeliveryTypeConfigMap';
import {getConfigKey} from './getConfigKey';

describe('getConfigKey', () => {
  it('throws exception on invalid input', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => getConfigKey('invalid')).toThrow();
  });

  const deliveryTypeConfigMap = getDeliveryTypeConfigMap();
  const shipmentOptionConfigMap = getShipmentOptionConfigMap();

  const matrix = {
    ...deliveryTypeConfigMap,
    ...shipmentOptionConfigMap,
  };

  it.each(Object.entries(matrix))('returns correct config key for %s', (type, expected) => {
    expect(getConfigKey(type)).toBe(expected);
  });
});
