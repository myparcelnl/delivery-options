import './assets/style.scss';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {createMyParcelFormBuilderPlugin} from '@myparcel-dev/vue-form-builder';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia()).use(createMyParcelFormBuilderPlugin()).mount('#app');
