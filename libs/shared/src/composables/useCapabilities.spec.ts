import {describe, it, expect} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {useCapabilities} from './useCapabilities';

const API_BASE_URL = 'https://proxy.example.com/capabilities';

describe('useCapabilities', () => {
  it('returns capabilities data after loading', async () => {
    const {capabilities, loading} = useCapabilities(API_BASE_URL, 'NL');

    await flushPromises();

    expect(loading.value).toBe(false);
    expect(capabilities.value.results.length).toBeGreaterThan(0);
  });

  it('finds PostNL by lowercase name', async () => {
    const {getCarrierCapability} = useCapabilities(API_BASE_URL, 'NL');

    await flushPromises();

    const postnl = getCarrierCapability('postnl');

    expect(postnl).toBeDefined();
    expect(postnl?.carrier).toBe('POSTNL');
  });

  it('finds DHL For You by UPPER_CASE name', async () => {
    const {getCarrierCapability} = useCapabilities(API_BASE_URL, 'NL');

    await flushPromises();

    const dhl = getCarrierCapability('DHL_FOR_YOU');

    expect(dhl).toBeDefined();
    expect(dhl?.carrier).toBe('DHL_FOR_YOU');
  });

  it('returns undefined for nonexistent carrier', async () => {
    const {getCarrierCapability} = useCapabilities(API_BASE_URL, 'NL');

    await flushPromises();

    expect(getCarrierCapability('nonexistent')).toBeUndefined();
  });

  it('returns normalized carrier names in availableCarrierNames', async () => {
    const {availableCarrierNames} = useCapabilities(API_BASE_URL, 'NL');

    await flushPromises();

    expect(availableCarrierNames.value).toContain('postnl');
    expect(availableCarrierNames.value).toContain('dhlforyou');
    // All names should be lowercase without underscores
    for (const name of availableCarrierNames.value) {
      expect(name).toBe(name.toLowerCase());
      expect(name).not.toContain('_');
    }
  });

  it('returns empty results for unsupported country', async () => {
    const {capabilities} = useCapabilities(API_BASE_URL, 'XX');

    await flushPromises();

    expect(capabilities.value.results).toEqual([]);
  });
});
