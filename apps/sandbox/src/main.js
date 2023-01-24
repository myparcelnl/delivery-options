import './assets/scss/sandbox/style.scss';
import '../../delivery-options/src/delivery-options/services/filters';
import '../../delivery-options/src/delivery-options/services/directives';
import '../../delivery-options/src/sandbox/services/filters';
import Sandbox from '../../delivery-options/src/sandbox/Sandbox';
import Vue from 'vue';
import { appConfig } from '../../delivery-options/src/config/appConfig';
import { configObject } from '../../delivery-options/src/sandbox/config';
import { cssClassBase } from '../../delivery-options/src/delivery-options/cssClassBase';
import { getUrl } from '../../delivery-options/src/config/urlConfig';
import { i18n } from '../../delivery-options/src/sandbox/services/vue-i18n';
import { isDev } from '../../delivery-options/src/helpers/environment';
import { useBootstrap } from '../../delivery-options/src/sandbox/services/bootstrap';

useBootstrap();

// Set this in advance to be able to load the delivery options later without a config set.
window.MyParcelConfig = {};

Vue.prototype.$appConfig = appConfig;
Vue.prototype.$classBase = cssClassBase;
Vue.prototype.$config = configObject;
Vue.prototype.$getUrl = getUrl;

Vue.config.performance = isDev;
Vue.config.productionTip = false;

export const app = new Vue({
  name: 'MyParcelDeliveryOptionsSandbox',
  i18n,
  render: (h) => h(Sandbox),
}).$mount(`#${cssClassBase}`);
