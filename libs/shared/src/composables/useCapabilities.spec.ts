import {ref, watch} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {mockCapabilitiesFetch} from '@myparcel-dev/do-shared/testing';
import {type CapabilitiesRequest, type CarrierCapability} from '../types';
import {useReactiveCapabilities} from './useCapabilities';

const makeCapability = (id?: number): CarrierCapability => ({
  carrier: 'DPD',
  ...(id === undefined ? {} : {contract: {id}}),
  packageTypes: ['PACKAGE'],
  deliveryTypes: ['STANDARD_DELIVERY', 'PICKUP_DELIVERY'],
  options: {},
});
const respond = (results: CarrierCapability[]) =>
  mockCapabilitiesFetch.mockResolvedValueOnce({ok: true, json: () => Promise.resolve({results})} as Response);
const weightedRequest = (): CapabilitiesRequest => ({
  recipient: {countryCode: 'NL'},
  physicalProperties: {weight: {value: 30000, unit: 'g'}},
});

describe('weighted carrier contract lookup', () => {
  beforeEach(() => mockCapabilitiesFetch.mockReset());

  it('uses an exact contract from a legacy carrier identifier', async () => {
    respond([makeCapability(99), makeCapability(12)]);
    const {getCarrierCapability} = useReactiveCapabilities('https://example.test/capabilities', ref(weightedRequest()));
    await flushPromises();
    expect(getCarrierCapability('dpd:12')?.contract?.id).toBe(12);
    expect(getCarrierCapability('dpd:13')).toBeUndefined();
  });

  it('preserves older responses without contract information', async () => {
    respond([makeCapability()]);
    const {getCarrierCapability} = useReactiveCapabilities('https://example.test/capabilities', ref(weightedRequest()));
    await flushPromises();
    expect(getCarrierCapability('dpd', 12)?.carrier).toBe('DPD');
  });

  it('does not select unscoped data alongside a different explicit contract', async () => {
    respond([makeCapability(), makeCapability(99)]);
    const {getCarrierCapability} = useReactiveCapabilities('https://example.test/capabilities', ref(weightedRequest()));
    await flushPromises();
    expect(getCarrierCapability('dpd', 12)).toBeUndefined();
  });

  it('keeps the legacy contract lookup when weight becomes unknown, even for identical response data', async () => {
    respond([makeCapability(99)]);
    const request = ref(weightedRequest());
    const {getCarrierCapability} = useReactiveCapabilities('https://example.test/capabilities', request);
    await flushPromises();
    expect(getCarrierCapability('dpd', 12)).toBeUndefined();
    respond([makeCapability(99)]);
    request.value = {recipient: {countryCode: 'NL'}};
    await flushPromises();
    expect(getCarrierCapability('dpd', 12)?.contract?.id).toBe(99);
  });

  it('publishes response data and scope together without temporarily removing the selected carrier', async () => {
    respond([makeCapability(99)]);
    const request = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});
    const {getCarrierCapability} = useReactiveCapabilities('https://example.test/capabilities', request);
    await flushPromises();
    const seen: (number | undefined)[] = [];
    const stop = watch(
      () => getCarrierCapability('dpd', 12)?.contract?.id,
      (id) => seen.push(id),
      {flush: 'sync', immediate: true},
    );
    respond([makeCapability(12)]);
    request.value = weightedRequest();
    await flushPromises();
    stop();
    expect(seen).toEqual([99, 12]);
  });
});
