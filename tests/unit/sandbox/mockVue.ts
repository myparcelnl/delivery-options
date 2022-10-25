import { appConfig } from '@/config/appConfig';
import { configObject } from '@/sandbox/config';
import { createLocalVue } from '@vue/test-utils';
import { getUrl } from '@/config/urlConfig';
import { useBootstrap } from '@/sandbox/services/bootstrap';
import { vTest } from '@/delivery-options/services/directives/v-test';

export const mockVue = () => {
  const localVue = createLocalVue();

  useBootstrap(localVue);

  localVue.prototype.$appConfig = appConfig;
  localVue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
  localVue.prototype.$config = configObject;
  localVue.prototype.$getUrl = getUrl;

  localVue.component('font-awesome-icon', { template: '<i></i>' });

  localVue.directive('test', vTest);

  return localVue;
};
