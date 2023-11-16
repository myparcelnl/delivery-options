import {CONFIG} from '@myparcel-do/shared';
import ToggleInput from '../components/form/FormToggleInput.vue';
import {perCarrier} from './perCarrier';
import {ifAnyCarrierAllows} from './ifAnyCarrierAllows';
import {getStandardDeliveryGroup} from './getStandardDeliveryGroup';
import {getShipmentOptionsSection} from './getShipmentOptionsSection';
import {getSaturdayDeliveryGroup} from './getSaturdayDeliveryGroup';
import {getSameDayDeliveryGroup} from './getSameDayDeliveryGroup';
import {getPackageTypeGroup} from './getPackageTypeGroup';
import {getMorningDeliveryGroup} from './getMorningDeliveryGroup';
import {getMondayDeliveryGroup} from './getMondayDeliveryGroup';
import {getEveningDeliveryGroup} from './getEveningDeliveryGroup';
import {getDeliveryDateGroup} from './getDeliveryDateGroup';

/**
 * @deprecated
 */
export const getDeliveryFields = () => {
  return [
    ...perCarrier({
      name: CONFIG.ALLOW_DELIVERY_OPTIONS,
      component: ToggleInput,
    }),

    getDeliveryDateGroup(),

    getStandardDeliveryGroup(),

    ...ifAnyCarrierAllows(CONFIG.ALLOW_SAME_DAY_DELIVERY, getSameDayDeliveryGroup()),

    ...ifAnyCarrierAllows(CONFIG.ALLOW_MORNING_DELIVERY, getMorningDeliveryGroup()),

    ...ifAnyCarrierAllows(CONFIG.ALLOW_EVENING_DELIVERY, getEveningDeliveryGroup()),

    ...ifAnyCarrierAllows(CONFIG.ALLOW_MONDAY_DELIVERY, getMondayDeliveryGroup()),

    ...ifAnyCarrierAllows(CONFIG.ALLOW_SATURDAY_DELIVERY, getSaturdayDeliveryGroup()),

    ...ifAnyCarrierAllows(
      [CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX],
      getPackageTypeGroup(),
    ),

    getShipmentOptionsSection(),
  ];
};
