import {describe, expect, test} from 'vitest';
import {shallowMount} from '@vue/test-utils';

describe.skip('Test logic', () => {
  test('v-test directive works', () => {
    const template = `
      <div v-test="'hello'">
        <h1 id="my-header" v-test></h1>
        <p v-test="{
          many: 'things',
          going: 'on'
        }" />
      </div>
      `;
    const wrapper = shallowMount({
      template,
      directives: {test: vTest},
    });

    expect(wrapper.find('[data-test-id="hello"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="my-header"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-many="things"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-going="on"]').exists()).toBe(true);
  });
});
