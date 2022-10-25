import './assets/scss/style.scss';
import '@/delivery-options/services/filters';
import '@/delivery-options/services/directives';
import Sandbox from '@/Sandbox.vue';
import {configObject} from '@/config';
import {useAppConfig} from '@myparcel/delivery-options-shared/src/config';
import {createApp} from 'vue';
import {getUrl} from '@/config/urlConfig';
import {i18n} from '@/services/vue-i18n';
import {useBootstrap} from '@/services/bootstrap';

useBootstrap();

// Set this in advance to be able to load the delivery options later without a config set.
window.MyParcelConfig = {};

// Vue.prototype.$appConfig = useAppConfig();
// Vue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
// Vue.prototype.$config = configObject;
// Vue.prototype.$getUrl = getUrl;

const app = createApp(Sandbox);

app.use((instance) => {
  instance.config.globalProperties.$appConfig = useAppConfig();
  instance.config.globalProperties.$classBase = process.env.VUE_APP_CLASS_BASE;
  instance.config.globalProperties.$config = configObject;
  instance.config.globalProperties.$getUrl = getUrl;
});

app.use(i18n);

// export const app = new Vue({
//   name: 'MyParcelDeliveryOptionsSandbox',
//   i18n,
//   render: (h) => h(Sandbox),
// }).$mount(`#${process.env.VUE_APP_CLASS_BASE}`);
