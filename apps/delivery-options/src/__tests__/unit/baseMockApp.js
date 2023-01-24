/* eslint-disable max-params */
import { mount, shallowMount } from '@vue/test-utils';
import DeliveryOptions from '../../DeliveryOptions';
import { MYPARCEL } from '@/data/keys/platformKeys';
import Sandbox from '@/sandbox/Sandbox';
import { addWrapperExtensions } from '@Tests/unit/wrapperExtensions';
import { i18n } from '@/sandbox/services/vue-i18n';
import { mockVue as mockDeliveryOptionsVue } from './delivery-options/mockVue';
import { mockVue as mockSandboxVue } from './sandbox/mockVue';

/**
 * @param {String} app
 * @param {Object} component
 * @param {Object|MyParcel.CarrierName} configBusData - Parameters to pass to mockConfigBus().
 * @param {Object} wrapperData
 * @param {Boolean} shallow - Whether or not to do a shallow mount.
 * @returns {Wrapper}
 */
export function baseMockApp(
  app,
  component,
  configBusData = null,
  wrapperData = null,
  shallow = false,
) {
  configBusData = configBusData || MYPARCEL;
  wrapperData = wrapperData || {};

  const isSandbox = app === 'sandbox';
  const fallbackComponent = isSandbox ? Sandbox : DeliveryOptions;
  const mockFunction = isSandbox ? mockSandboxVue : mockDeliveryOptionsVue;
  const mountFunction = shallow ? shallowMount : mount;

  const wrapper = mountFunction(
    component || fallbackComponent,
    {
      localVue: wrapperData.localVue || mockFunction(configBusData),
      i18n,
      ...wrapperData,
    },
  );

  return addWrapperExtensions(wrapper);
}
