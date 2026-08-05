import {ref, type ComputedRef} from 'vue';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {type CapabilitiesRequest, useReactiveCapabilities} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';
import {useSandboxCapabilities} from './useSandboxCapabilities';

vi.mock('@myparcel-dev/do-shared', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const original = await importOriginal<typeof import('@myparcel-dev/do-shared')>();

  return {
    ...original,
    useReactiveCapabilities: vi.fn(() => ({availableCarrierNames: ref([])})),
  };
});

const getRequest = (isBusiness?: boolean): CapabilitiesRequest => {
  const store = useSandboxStore();

  store.config = isBusiness === undefined ? {} : {isBusiness};

  useSandboxCapabilities();

  const [, request] = vi.mocked(useReactiveCapabilities).mock.calls[0] as [unknown, ComputedRef<CapabilitiesRequest>];

  return request.value;
};

describe('useSandboxCapabilities', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.mocked(useReactiveCapabilities).mockClear();
  });

  it('leaves isBusiness out of the request when it is not set', () => {
    expect('isBusiness' in getRequest().recipient).toBe(false);
  });

  it('sends isBusiness for a business recipient', () => {
    expect(getRequest(true).recipient.isBusiness).toBe(true);
  });

  it('sends isBusiness for a consumer recipient', () => {
    expect(getRequest(false).recipient.isBusiness).toBe(false);
  });
});
