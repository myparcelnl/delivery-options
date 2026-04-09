import {type SupportedDeliveryTypeName} from '../types';
import {CarrierSetting} from '../data';
import {
  DELIVERY_TYPE_MAP,
  DELIVERY_DAY_OPTION_MAP,
  toDeliveryAllowKey,
  toOptionAllowKey,
  toCustomDeliveryType,
} from './capabilitiesMapping';

export const getDeliveryTypeConfigMap = (): Record<SupportedDeliveryTypeName, CarrierSetting> =>
  ({
    ...Object.fromEntries(Object.values(DELIVERY_TYPE_MAP).map((sdk) => [sdk, toDeliveryAllowKey(sdk)])),
    ...Object.fromEntries(
      Object.values(DELIVERY_DAY_OPTION_MAP).map((sdkParam) => [
        toCustomDeliveryType(sdkParam),
        toOptionAllowKey(sdkParam),
      ]),
    ),
  }) as Record<SupportedDeliveryTypeName, CarrierSetting>;
