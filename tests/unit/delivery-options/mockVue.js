import AsyncComputed from 'vue-async-computed';
import { MYPARCEL } from '@/data/keys/platformKeys';
import RecursiveForm from '@/delivery-options/components/RecursiveForm/RecursiveForm';
import { createLocalVue } from '@vue/test-utils';
import { cssClassBase } from '@/delivery-options/cssClassBase';
import { mockConfigBus } from './mockConfigBus';
import { vTest } from '@/delivery-options/services/directives/v-test';

export const mockVue = (data = MYPARCEL) => {
  const localVue = createLocalVue();

  localVue.use(AsyncComputed);
  localVue.component('RecursiveForm', RecursiveForm);

  localVue.prototype.$classBase = cssClassBase;
  localVue.prototype.$configBus = mockConfigBus(data);

  localVue.directive('test', vTest);

  return localVue;
};
