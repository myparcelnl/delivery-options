import {describe, it, expect} from 'vitest';
import {render, fireEvent} from '@testing-library/vue';
import {type SelectOption} from '@myparcel-dev/do-shared';
import CheckboxGroupInput from './CheckboxGroupInput.vue';

const createOptions = (
  selected: Record<string, boolean> = {},
  values: string[] = ['signature', 'only_recipient'],
): SelectOption<string>[] => {
  return values.map((value) => ({
    label: value,
    value,
    selected: selected[value] ?? false,
  }));
};

describe('CheckboxGroupInput.vue', () => {
  it('emits the value when an option becomes selected', async () => {
    const {emitted, rerender} = render(CheckboxGroupInput, {
      props: {id: 'shipmentOptions', options: createOptions(), modelValue: []},
    });

    await rerender({options: createOptions({signature: true})});

    expect(emitted('update:modelValue')?.at(-1)).toEqual([['signature']]);
  });

  it('removes the value when an option is no longer selected', async () => {
    const {emitted, rerender} = render(CheckboxGroupInput, {
      props: {
        id: 'shipmentOptions',
        options: createOptions({signature: true}),
        modelValue: ['signature'],
      },
    });

    await rerender({options: createOptions()});

    expect(emitted('update:modelValue')?.at(-1)).toEqual([[]]);
  });

  it('does not emit again when the options change but the selected state does not', async () => {
    const {emitted, rerender} = render(CheckboxGroupInput, {
      props: {
        id: 'shipmentOptions',
        options: createOptions({signature: true}),
        modelValue: ['signature'],
      },
    });

    const emitCount = emitted('update:modelValue')?.length ?? 0;

    await rerender({options: createOptions({signature: true})});

    expect(emitted('update:modelValue')?.length ?? 0).toBe(emitCount);
  });

  it('emits the new value when other options replace the selected ones', async () => {
    const {emitted, rerender} = render(CheckboxGroupInput, {
      props: {
        id: 'shipmentOptions',
        options: createOptions({signature: true}),
        modelValue: ['signature'],
      },
    });

    await rerender({
      options: createOptions({age_check: true}, ['age_check', 'large_format']),
    });

    expect(emitted('update:modelValue')?.at(-1)).toEqual([['age_check']]);
  });

  it('emits the value when the checkbox is checked and removes it when unchecked', async () => {
    const {emitted, getByRole, rerender} = render(CheckboxGroupInput, {
      props: {id: 'shipmentOptions', options: createOptions(), modelValue: []},
    });

    const checkbox = getByRole('checkbox', {name: 'signature'});

    await fireEvent.click(checkbox);
    expect(emitted('update:modelValue')?.at(-1)).toEqual([['signature']]);

    await rerender({modelValue: ['signature']});
    await fireEvent.click(checkbox);
    expect(emitted('update:modelValue')?.at(-1)).toEqual([[]]);
  });
});
