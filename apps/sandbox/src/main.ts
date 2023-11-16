import {createApp} from 'vue';
import './assets/style.scss';
import {createPinia} from 'pinia';
import {useLanguage} from '@myparcel-do/shared';
import {createMyParcelFormBuilderPlugin} from '@myparcel/vue-form-builder';
import App from './App.vue';

const app = createApp(App);

const {translate} = useLanguage();

app
  .use(
    createMyParcelFormBuilderPlugin({
      renderLabel: translate,
    }),
  )
  .use(createPinia())
  .mount('#app');
