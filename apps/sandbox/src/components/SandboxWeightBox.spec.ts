import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {fireEvent, render} from '@testing-library/vue';
import {WEIGHT_TOO_HEAVY, WEIGHT_UNDERWEIGHT} from '@myparcel-dev/do-shared/testing';
import {useSandboxStore} from '../stores';
import SandboxWeightBox from './SandboxWeightBox.vue';

vi.mock('../composables', () => ({
  useBaseInputClasses: () => [],
  useLanguage: () => ({translate: (value: string) => value}),
}));

describe('SandboxWeightBox', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('sets a positive gram weight and clears it to null', async () => {
    const store = useSandboxStore();
    store.config = {};
    const view = render(SandboxWeightBox);
    const field = view.getByLabelText('Shipment weight (g)');
    expect(field.value).toBe('');
    await fireEvent.change(field, {target: {value: String(WEIGHT_TOO_HEAVY)}});
    expect(store.config.physicalProperties).toEqual({weight: WEIGHT_TOO_HEAVY});
    await fireEvent.change(field, {target: {value: String(WEIGHT_UNDERWEIGHT)}});
    expect(store.config.physicalProperties).toEqual({weight: WEIGHT_UNDERWEIGHT});
    await fireEvent.change(field, {target: {value: ''}});
    expect(store.config.physicalProperties).toBeNull();
  });

  it.each(['0', '-1', '1.5'])('does not send invalid input %s', async (value) => {
    useSandboxStore().config.physicalProperties = {weight: WEIGHT_TOO_HEAVY};
    const view = render(SandboxWeightBox);
    await fireEvent.change(view.getByLabelText('Shipment weight (g)'), {target: {value}});
    expect(useSandboxStore().config.physicalProperties).toBeNull();
  });
});
