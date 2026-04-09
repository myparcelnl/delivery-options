import {type SupportedShipmentOptionName} from '../types';
import {type CarrierSetting} from '../data';
import {SHIPMENT_OPTION_MAP, toOptionAllowKey} from './capabilitiesMapping';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getShipmentOptionConfigMap = (): Record<SupportedShipmentOptionName, CarrierSetting> =>
  Object.fromEntries(Object.values(SHIPMENT_OPTION_MAP).map((sdk) => [sdk, toOptionAllowKey(sdk)])) as Record<
    SupportedShipmentOptionName,
    CarrierSetting
  >;
