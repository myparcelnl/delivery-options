import {ref} from 'vue';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {fireEvent, render, type RenderResult} from '@testing-library/vue';
import {useSandboxStore} from '../stores';
import SandboxRecipientTypeBox from './SandboxRecipientTypeBox.vue';

vi.mock('@vueuse/core', () => {
  return {
    useLocalStorage: <T>(_: string, defaultValue: T | (() => T)) => {
      const resolved = typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
      return ref(resolved);
    },
  };
});

vi.mock('../composables', () => {
  return {
    useLanguage: () => ({
      translate: (translatable: string | {key: string}) =>
        typeof translatable === 'string' ? translatable : translatable.key,
    }),
  };
});

const NOT_SET = 'Not set';
const BUSINESS = 'Business (B2B)';
const CONSUMER = 'Consumer (B2C)';

const renderBox = (isBusiness?: boolean): RenderResult => {
  const store = useSandboxStore();

  store.config = isBusiness === undefined ? {} : {isBusiness};

  return render(SandboxRecipientTypeBox);
};

describe('SandboxRecipientTypeBox', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('selects "not set" when the config has no isBusiness', () => {
    const res = renderBox();

    expect(res.getByLabelText(NOT_SET).checked).toBe(true);
  });

  it('selects business when isBusiness is true', () => {
    const res = renderBox(true);

    expect(res.getByLabelText(BUSINESS).checked).toBe(true);
  });

  it('selects consumer when isBusiness is false', () => {
    const res = renderBox(false);

    expect(res.getByLabelText(CONSUMER).checked).toBe(true);
  });

  it('sets isBusiness to true when picking business', async () => {
    const res = renderBox();

    await fireEvent.update(res.getByLabelText(BUSINESS));

    expect(useSandboxStore().config.isBusiness).toBe(true);
  });

  it('sets isBusiness to false when picking consumer', async () => {
    const res = renderBox();

    await fireEvent.update(res.getByLabelText(CONSUMER));

    expect(useSandboxStore().config.isBusiness).toBe(false);
  });

  it('removes isBusiness from the config when picking "not set"', async () => {
    const res = renderBox(true);

    await fireEvent.update(res.getByLabelText(NOT_SET));

    // The key has to disappear, not become undefined: the widget only omits it from the
    // capabilities request when it is absent, which is how hosts that never send it behave.
    expect('isBusiness' in useSandboxStore().config).toBe(false);
  });
});
