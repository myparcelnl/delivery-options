import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {fireEvent, render} from '@testing-library/vue';
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
    await fireEvent.change(field, {target: {value: '30000'}});
    expect(store.config.physicalProperties).toEqual({weight: 30000});
    await fireEvent.change(field, {target: {value: '15000'}});
    expect(store.config.physicalProperties).toEqual({weight: 15000});
    await fireEvent.change(field, {target: {value: ''}});
    expect(store.config.physicalProperties).toBeNull();
  });

  it.each(['0', '-1', '1.5'])('does not send invalid input %s', async (value) => {
    useSandboxStore().config.physicalProperties = {weight: 30000};
    const view = render(SandboxWeightBox);
    await fireEvent.change(view.getByLabelText('Shipment weight (g)'), {target: {value}});
    expect(useSandboxStore().config.physicalProperties).toBeNull();
  });
});
