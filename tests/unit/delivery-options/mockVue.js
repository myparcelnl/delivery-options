import AsyncComputed from 'vue-async-computed';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { MYPARCEL } from '@/data/keys/platformKeys';
import RecursiveForm from '@/delivery-options/components/RecursiveForm/RecursiveForm';
import { createLocalVue } from '@vue/test-utils';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { library } from '@fortawesome/fontawesome-svg-core';
import { mockConfigBus } from './mockConfigBus';
import { vTest } from '@/delivery-options/services/directives/v-test';

export const mockVue = (data = MYPARCEL) => {
  const localVue = createLocalVue();

  localVue.use(AsyncComputed);
  localVue.component('font-awesome-icon', FontAwesomeIcon);
  localVue.component('recursive-form', RecursiveForm);

  localVue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
  localVue.prototype.$configBus = mockConfigBus(data);

  localVue.directive('test', vTest);

  library.add(faEllipsisH, faTimes);

  return localVue;
};
