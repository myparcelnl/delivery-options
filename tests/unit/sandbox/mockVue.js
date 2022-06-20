import { appConfig } from '@/config/appConfig';
import { configObject } from '@/sandbox/config';
import { createLocalVue } from '@vue/test-utils';
import { cssClassBase } from '@/delivery-options/cssClassBase';
import { getUrl } from '@/config/urlConfig';
import { useBootstrap } from '@/sandbox/services/bootstrap';
import { vTest } from '@/delivery-options/services/directives/v-test';

export const mockVue = () => {
  const localVue = createLocalVue();

  useBootstrap(localVue);

  localVue.prototype.$appConfig = appConfig;
  localVue.prototype.$classBase = cssClassBase;
  localVue.prototype.$config = configObject;
  localVue.prototype.$getUrl = getUrl;

  localVue.component('FontAwesomeIcon', { template: '<i></i>' });

  localVue.directive('test', vTest);

  return localVue;
};
