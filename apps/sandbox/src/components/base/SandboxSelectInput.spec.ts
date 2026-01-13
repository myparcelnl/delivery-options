import {nextTick} from 'vue';
import {describe, expect, it} from 'vitest';
import {render, type RenderResult} from '@testing-library/vue';
import {type SelectOptionValue, type SelectOption} from '@myparcel-dev/do-shared';
import SandboxSelectInput from './SandboxSelectInput.vue';

/**
 * @vitest-environment happy-dom
 */

const renderElement = <T extends SelectOptionValue>(options: SelectOption<T>[], modelValue?: T): RenderResult => {
  return render(SandboxSelectInput, {props: {options, modelValue}});
};

describe('SelectInput', () => {
  it.todo('opens the dropdown when clicking on the input', async () => {
    expect.assertions(3);

    const res = renderElement([
      {label: 'Foo', value: 'foo'},
      {label: 'Bar', value: 'bar'},
    ]);

    const select = await res.getByRole('listbox');
    select.click();
    await nextTick();

    const listItems = await res.getAllByRole('option');

    expect(listItems).toHaveLength(2);
    expect(listItems.map((item) => item.textContent)).toEqual(['Foo', 'Bar']);
  });

  it.todo('closes the dropdown when clicking outside the element', async () => {});
  it.todo('close the dropdown when pressing escape', async () => {});
  it.todo('updates value and closes the dropdown when clicking on an option', async () => {});
  it.todo('updates value and closes the dropdown when pressing enter on an option', async () => {});
  it.todo('does not allow tabbing out of the element when the dropdown is open', async () => {});
});
