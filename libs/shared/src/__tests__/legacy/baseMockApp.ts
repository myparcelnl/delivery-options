/* eslint-disable max-params */
import {mount, shallowMount} from '@vue/test-utils';
import {MYPARCEL} from '../../legacy';
import {addWrapperExtensions} from './wrapperExtensions';

export const baseMockApp = (
  app,
  component,
  configBusData = null,
  wrapperData = null,
  shallow = false,
) => {
  configBusData = configBusData || MYPARCEL;
  wrapperData = wrapperData || {};

  const isSandbox = app === 'sandbox';
  const fallbackComponent = isSandbox ? Sandbox : DeliveryOptions;
  const mockFunction = isSandbox ? mockSandboxVue : mockDeliveryOptionsVue;
  const mountFunction = shallow ? shallowMount : mount;

  const localVue = wrapperData.localVue || mockFunction(configBusData);

  const wrapper = mountFunction(
    component || fallbackComponent,
    {
      localVue,
      i18n,
      ...wrapperData,
    },
  );

  return addWrapperExtensions(wrapper);
};
