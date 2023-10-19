import {createApp} from 'vue';
import './assets/style.scss';
import {createPinia} from 'pinia';
import {createMyParcelFormBuilderPlugin} from '@myparcel/vue-form-builder';
import App from './App.vue';

const app = createApp(App);

app.use(createMyParcelFormBuilderPlugin()).use(createPinia()).mount('#app');
