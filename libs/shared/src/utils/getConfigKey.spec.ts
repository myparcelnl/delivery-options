import {describe, expect, it} from 'vitest';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getPackageTypeConfigMap} from './getPackageTypeConfigMap';
import {getDeliveryTypeConfigMap} from './getDeliveryTypeConfigMap';
import {getConfigKey} from './getConfigKey';

describe('getConfigKey', () => {
  it('returns null for invalid input', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(getConfigKey('invalid')).toBeNull();
  });

  const packageTypeConfigMap = getPackageTypeConfigMap();
  const deliveryTypeConfigMap = getDeliveryTypeConfigMap();
  const shipmentOptionConfigMap = getShipmentOptionConfigMap();

  const matrix = {
    ...packageTypeConfigMap,
    ...deliveryTypeConfigMap,
    ...shipmentOptionConfigMap,
  };

  it.each(Object.entries(matrix))('returns correct config key for %s', (type, expected) => {
    expect(getConfigKey(type)).toBe(expected);
  });
});