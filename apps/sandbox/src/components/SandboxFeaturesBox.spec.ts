import {ref} from 'vue';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {fireEvent, render} from '@testing-library/vue';
import {ConfigSetting} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';
import SandboxFeaturesBox from './SandboxFeaturesBox.vue';

vi.mock('../composables', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useLanguage: () => ({
    has: () => false,
    language: ref({code: 'en'}),
    translate: (value: string) => value,
  }),
}));

describe('SandboxFeaturesBox', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it.each([
    [ConfigSetting.Currency, 'DKK', 'DKK'],
    [ConfigSetting.Currency, '', ''],
    [ConfigSetting.Locale, 'da-DK', 'da-DK'],
    [ConfigSetting.Locale, '', undefined],
  ])('sets %s from the field value "%s" to %s', async (setting, value, expected) => {
    const view = render(SandboxFeaturesBox);

    await fireEvent.change(view.getByLabelText(`option_${setting}`), {target: {value}});

    expect(useSandboxStore().config[setting]).toBe(expected);
  });
});
