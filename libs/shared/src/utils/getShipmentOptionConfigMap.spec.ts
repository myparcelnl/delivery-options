import {describe, expect, it} from 'vitest';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';

describe('getShipmentOptionConfigMap', () => {
  it('should return the correct config map', () => {
    expect(getShipmentOptionConfigMap()).toMatchSnapshot();
  });
});
