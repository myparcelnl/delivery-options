import {describe, expect, test} from 'vitest';
import {mockSandbox, shallowMockSandbox} from './mockSandbox';

describe.skip('Sandbox form components', () => {
  // Test options.
  const options = [
    {
      text: 'Option A',
      value: 'a',
    },
    {
      text: 'Option B',
      value: 'b',
    },
  ];

  test('CCodeEditor', async () => {
    expect.assertions(9);

    /** @type {Wrapper<CCodeEditor>} */
    const wrapper = mockSandbox(null, null, CCodeEditor);
    const textarea = wrapper.find('textarea');

    const value = JSON.stringify({data: {code: ['test code']}});

    textarea.setValue(value);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().input[0]).toEqual([value]);

    await wrapper.vm.$nextTick();
    expect(wrapper.find('textarea').element).toHaveValue('{"data":{"code":["test code"]}}');

    const codeWrapper = wrapper.findByTestId('code');
    const textWrapper = wrapper.findByTestId('text');

    wrapper.vm.showCode();
    await wrapper.vm.$nextTick();
    expect(codeWrapper.isVisible()).toBeTruthy();
    expect(textWrapper.isVisible()).toBeFalsy();

    wrapper.vm.hideCode();
    await wrapper.vm.$nextTick();
    expect(codeWrapper.isVisible()).toBeFalsy();
    expect(textWrapper.isVisible()).toBeTruthy();

    wrapper.vm.showCode();
    await wrapper.vm.$nextTick();
    expect(codeWrapper.isVisible()).toBeTruthy();
    expect(textWrapper.isVisible()).toBeFalsy();

    textarea.setValue(['invalid data']);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.valid).toBe(false);
  });

  test('CCountrySelect', async () => {
    expect.assertions(1);
    const wrapper = shallowMockSandbox(null, null, CCountrySelect);

    wrapper.vm.$i18n.locale = 'nl';
    wrapper.vm.$i18n.locale = 'en';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.mutableOptions).toContainObject({
      text: 'Sweden',
      value: 'SE',
    });
  });

  test('CCurrency', () => {
    const wrapper = mockSandbox(
      null,
      {
        i18n,
        propsData: {
          value: '2.36',
        },
      },
      CCurrency,
    );

    expect(wrapper.find('input').element).toHaveValue(2.36);
  });

  test.each([
    ['@/sandbox/components/form/CCheckboxGroup', {options}],
    ['@/sandbox/components/form/CNumber'],
    ['@/sandbox/components/form/CRadioGroup', {options}],
    ['@/sandbox/components/form/CSelect', {options}],
    ['@/sandbox/components/form/CTextInput'],
    ['@/sandbox/components/form/CTextarea'],
    ['@/sandbox/components/form/CTimepicker'],
    ['@/sandbox/components/form/CToggle'],
  ])('%s', async (componentPath, propsData = {}) => {
    expect.assertions(1);
    const component = (await import(componentPath)).default;
    const wrapper = mockSandbox(null, {propsData}, component);

    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
