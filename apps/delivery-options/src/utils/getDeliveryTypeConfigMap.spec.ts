import {describe, expect, it} from 'vitest';
import {getDeliveryTypeConfigMap} from './getDeliveryTypeConfigMap';

describe('getDeliveryTypeConfigMap', () => {
  it('should return the correct config map', () => {
    expect(getDeliveryTypeConfigMap()).toMatchSnapshot();
  });
});
