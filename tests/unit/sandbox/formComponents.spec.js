import { mockSandbox, shallowMockSandbox } from './mockSandbox';
import CCodeEditor from '@/sandbox/components/form/CCodeEditor';
import CCountrySelect from '@/sandbox/components/form/CCountrySelect';
import CCurrency from '@/sandbox/components/form/CCurrency';
import { i18n } from '@/sandbox/services/vue-i18n';
import CCheckboxGroup from '@/sandbox/components/form/CCheckboxGroup';
import { mockConfigBus } from '@Tests/unit/delivery-options/mockConfigBus';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import { mockDeliveryOptions } from '@Tests/unit/delivery-options/mockDeliveryOptions';
import * as CONFIG from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import * as CARRIERS from '@/data/keys/carrierKeys';
import { DROP_OFF_DAYS } from '@/data/keys/configKeys';

// Test options.
const options = [
  { text: 'Option A', value: 'a' },
  { text: 'Option B', value: 'b' },
];

describe('Sandbox form components', () => {
  test('CCodeEditor', async() => {
    expect.assertions(9);

    /** @type {Wrapper<CCodeEditor>} */
    const wrapper = mockSandbox(null, null, CCodeEditor);
    const textarea = wrapper.find('textarea');

    const value = JSON.stringify({ data: { code: ['test code'] } });

    textarea.setValue(value);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().input[0]).toEqual([value]);

    await wrapper.vm.$nextTick();
    expect(wrapper.find('textarea').element).toHaveValue(
      '{"data":{"code":["test code"]}}',
    );

    const { element: codeElement } = wrapper.findByTestId('code');
    const { element: textElement } = wrapper.findByTestId('text');

    wrapper.vm.showCode();
    await wrapper.vm.$nextTick();
    expect(codeElement).toBeVisible();
    expect(textElement).not.toBeVisible();

    wrapper.vm.hideCode();
    await wrapper.vm.$nextTick();
    expect(codeElement).not.toBeVisible();
    expect(textElement).toBeVisible();

    wrapper.vm.showCode();
    await wrapper.vm.$nextTick();
    expect(codeElement).toBeVisible();
    expect(textElement).not.toBeVisible();

    textarea.setValue(['invalid data']);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.valid).toBe(false);
  });

  test('CCountrySelect', async() => {
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
    ['@/sandbox/components/form/CCheckboxGroup', { options }],
    ['@/sandbox/components/form/CNumber'],
    ['@/sandbox/components/form/CRadioGroup', { options }],
    ['@/sandbox/components/form/CSelect', { options }],
    ['@/sandbox/components/form/CTextInput'],
    ['@/sandbox/components/form/CTextarea'],
    ['@/sandbox/components/form/CTimepicker'],
    ['@/sandbox/components/form/CToggle'],
  ])('%s', async(componentPath, propsData = {}) => {
    expect.assertions(1);
    const component = (await import(componentPath)).default;
    const wrapper = mockSandbox(null, { propsData }, component);

    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});
