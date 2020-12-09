import { mockSandbox, shallowMockSandbox } from './mockSandbox';
import CCheckboxGroup from '@/sandbox/components/form/CCheckboxGroup';
import CCodeEditor from '@/sandbox/components/form/CCodeEditor';
import CCountrySelect from '@/sandbox/components/form/CCountrySelect';
import CCurrency from '@/sandbox/components/form/CCurrency';
import CNumber from '@/sandbox/components/form/CNumber';
import CRadioGroup from '@/sandbox/components/form/CRadioGroup';
import CSelect from '@/sandbox/components/form/CSelect';
import CTextInput from '@/sandbox/components/form/CTextInput';
import CTextarea from '@/sandbox/components/form/CTextarea';
import CTimepicker from '@/sandbox/components/form/CTimepicker';
import CToggle from '@/sandbox/components/form/CToggle';
import { i18n } from '@/sandbox/services/vue-i18n';

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
      value: 'se',
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

  /**
   * Simple test for components without complex logic.
   */
  test('Other components', () => {
    const wrapper = mockSandbox(null, null, {
      template: `
        <div>
        <CCheckboxGroup />
        <CNumber />
        <CRadioGroup />
        <CSelect />
        <CTextInput />
        <CTextarea />
        <CTimepicker />
        <CToggle />
        </div>
      `,
      components: {
        CCheckboxGroup,
        CNumber,
        CRadioGroup,
        CSelect,
        CTextInput,
        CTextarea,
        CTimepicker,
        CToggle,
      },
    });

    expect(wrapper.vm.$el).toMatchInlineSnapshot(`
      <div>
        <div
          checked="checked"
          class="bv-no-focus-ring"
          disabledfield="disabled"
          htmlfield="html"
          options=""
          role="group"
          tabindex="-1"
          textfield="text"
          value=""
          valuefield="value"
        />
         
        <input
          class="form-control"
          debounce="0"
          formatter="default() {
            return getComponentConfig(componentKey, prop, (0, _inspect.isFunction)(defaultValue) ? defaultValue() : defaultValue);
          }"
          lazy="true"
          placeholder=<Default>
          step="1"
          type="number"
        />
         
        <div
          class="bv-no-focus-ring"
          options=""
          role="radiogroup"
          tabindex="-1"
        />
         
        <select
          class="custom-select"
          disabledfield="disabled"
          htmlfield="html"
          labelfield="label"
          options=""
          optionsfield="options"
          selectsize="0"
          textfield="text"
          valuefield="value"
        />
         
        <input
          class="form-control"
          lazy="true"
          placeholder=<Default>
          type="text"
        />
         
        <textarea
          class="form-control"
          debounce="0"
          formatter="function _default() {
              return getComponentConfig(componentKey, prop, isFunction(defaultValue) ? defaultValue() : defaultValue);
            }"
          rows="2"
          wrap="soft"
        />
         
        <input
          class="form-control"
          lazy="true"
          placeholder="HH:mm"
          type="time"
        />
         
        <div
          class="custom-control custom-switch b-custom-control-lg"
        >
          <input
            class="custom-control-input"
            type="checkbox"
            value="true"
          />
          <label
            class="custom-control-label"
          />
        </div>
      </div>
    `);
  });
});
