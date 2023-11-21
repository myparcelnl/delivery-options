import {createLocalVue} from '@vue/test-utils';
import {PlatformName} from '@myparcel/constants';

export const mockVue = (data = PlatformName.MyParcel) => {
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
