import * as BAlert from 'bootstrap-vue/src/components/alert';
import * as BButton from 'bootstrap-vue/src/components/button';
import * as BCard from 'bootstrap-vue/src/components/card';
import * as BCollapse from 'bootstrap-vue/src/components/collapse';
import * as BForm from 'bootstrap-vue/src/components/form';
import * as BFormCheckbox from 'bootstrap-vue/src/components/form-checkbox';
import * as BFormGroup from 'bootstrap-vue/src/components/form-group';
import * as BFormInput from 'bootstrap-vue/src/components/form-input';
import * as BFormSelect from 'bootstrap-vue/src/components/form-select';
import * as BInputGroup from 'bootstrap-vue/src/components/input-group';
import * as BJumbotron from 'bootstrap-vue/src/components/jumbotron';
import * as BLayout from 'bootstrap-vue/src/components/layout';
import * as BModal from 'bootstrap-vue/src/components/modal';
import * as BNav from 'bootstrap-vue/src/components/nav';
import * as BNavBar from 'bootstrap-vue/src/components/navbar';
import * as BPopover from 'bootstrap-vue/src/components/popover';
import * as BSpinner from 'bootstrap-vue/src/components/spinner';
import * as BTabs from 'bootstrap-vue/src/components/tabs';
import * as BTooltip from 'bootstrap-vue/src/components/tooltip';
import { baseMockApp } from '../baseMockApp';
import { i18n } from '@/sandbox/services/vue-i18n';

const bootstrapComponentSets = [
  BAlert,
  BButton,
  BCard,
  BCollapse,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BInputGroup,
  BJumbotron,
  BLayout,
  BModal,
  BNav,
  BNavBar,
  BPopover,
  BSpinner,
  BTabs,
  BTooltip,
];

const stubs = {
  FontAwesomeIcon: true,

  // All bootstrap-vue components
  ...bootstrapComponentSets.reduce((acc, component) => ({
    ...acc,
    ...Object
      .keys(component)
      .reduce((acc, component) => ({ ...acc, [component]: true }), {}),
  }), {}),

  // Some component aliases used that are not exported explicitly
  BBtn: true,
  BInput: true,
};

/**
 * @param {Object} configBusData
 * @param {Object} wrapperData
 * @param {Object} component
 * @returns {Wrapper}
 */
export function mockSandbox(configBusData = null, wrapperData = null, component = null) {
  return baseMockApp('sandbox', component, configBusData, { ...wrapperData, stubs, i18n }, false);
}

/**
 * @param {Object} configBusData
 * @param {Object} wrapperData
 * @param {Object} component
 * @returns {Wrapper}
 */
export function shallowMockSandbox(configBusData = null, wrapperData = null, component = null) {
  return baseMockApp('sandbox', component, configBusData, { ...wrapperData, stubs, i18n }, true);
}
