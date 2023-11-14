import {createLocalVue} from '@vue/test-utils';
import {MYPARCEL} from '@myparcel-do/shared';
import {mockConfigBus} from './mockConfigBus';

export const mockVue = (data = MYPARCEL) => {
  const localVue = createLocalVue();

  localVue.config.productionTip = false;
  localVue.config.devtools = false;

  localVue.use(AsyncComputed);
  localVue.component('RecursiveForm', RecursiveForm);

  localVue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
  localVue.prototype.$configBus = mockConfigBus(data);

  localVue.directive('test', vTest);

  return localVue;
};
