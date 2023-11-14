import {appConfig, getUrl} from '@myparcel-do/shared';

export const mockVue = () => {
  const localVue = createLocalVue();

  localVue.config.productionTip = false;
  localVue.config.devtools = false;

  useBootstrap(localVue);

  localVue.prototype.$appConfig = appConfig;
  localVue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
  localVue.prototype.$config = configObject;
  localVue.prototype.$getUrl = getUrl;

  localVue.component('FontAwesomeIcon', {template: '<i></i>'});

  localVue.directive('test', vTest);

  return localVue;
};
