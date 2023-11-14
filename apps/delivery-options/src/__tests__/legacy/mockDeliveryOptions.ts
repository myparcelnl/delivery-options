import {type DeliveryOptionsConfiguration} from '@myparcel-do/shared';

export const mockDeliveryOptions = (
  configBusData?: DeliveryOptionsConfiguration,
  wrapperData = null,
  component = null,
) => baseMockApp('delivery-options', component, configBusData, wrapperData, false);

export const shallowMockDeliveryOptions = (
  configBusData?: DeliveryOptionsConfiguration,
  wrapperData = null,
  component = null,
) => baseMockApp('delivery-options', component, configBusData, wrapperData, true);
