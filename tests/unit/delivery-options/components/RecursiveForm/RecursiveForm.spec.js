import RecursiveForm from '@/delivery-options/components/RecursiveForm/RecursiveForm';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { mockVue } from '@Tests/unit/delivery-options/mockVue';
import { mount } from '@vue/test-utils';

describe('RecursiveForm.vue', () => {
  let component;

  beforeAll(() => {
    component = mount(RecursiveForm, {
      localVue: mockVue(defaultConfiguration(SENDMYPARCEL)),
      propsData: {
        option: {
          name: 'carrier',
          type: 'radio',
          choices: [],
        },
      },
    });
  });

  it('correctly formats prices', () => {
    const { formatCurrency } = component.vm;
    // The spaces in the expected strings are non-breaking spaces.
    expect(formatCurrency(0)).toBe('€ 0,00');
    expect(formatCurrency(100)).toBe('€ 100,00');
    expect(formatCurrency(24.50)).toBe('€ 24,50');
  });
});
