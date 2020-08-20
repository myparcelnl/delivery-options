import { mount, shallowMount } from '@vue/test-utils';
import DeliveryOptions from '@/delivery-options/DeliveryOptions';
import { MYPARCEL } from '@/data/keys/platformKeys';
import Sandbox from '@/sandbox/Sandbox';
import { addWrapperExtensions } from '@Tests/unit/wrapperExtensions';
import { i18n } from '@/sandbox/services/vue-i18n';
import { mockVue as mockDeliveryOptionsVue } from './delivery-options/mockVue';
import { mockVue as mockSandboxVue } from './sandbox/mockVue';

/**
 * @param {String} app
 * @param {Object} component
 * @param {Object|MyParcel.CarrierName} data - Parameters to pass to mockConfigBus().
 * @param {Boolean} shallow - Whether or not to do a shallow mount.
 * @returns {Wrapper}
 */
export function baseMockApp(
  app,
  component,
  data = MYPARCEL,
  shallow = false,
) {
  const isSandbox = app === 'sandbox';
  const fallbackComponent = isSandbox ? Sandbox : DeliveryOptions;
  const mockFunction = isSandbox ? mockSandboxVue : mockDeliveryOptionsVue;
  const mountFunction = shallow ? shallowMount : mount;

  const wrapper = mountFunction(
    component || fallbackComponent,
    {
      localVue: data.localVue || mockFunction(),
      i18n,
      ...data,
    },
  );

  return addWrapperExtensions(wrapper);
}
