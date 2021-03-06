import * as CONFIG from '@/data/keys/configKeys';
import * as CONSTS from '@/data/keys/settingsConsts';
import { DELIVERY, DELIVERY_DATE, DELIVERY_MOMENT, SHIPMENT_OPTIONS } from '@/config/formConfig';
import { configBus } from '@/delivery-options/config/configBus';
import { createDeliveryDependencies } from '@/delivery-options/data/delivery/createDeliveryDependencies';
import { fetchDeliveryOptions } from '@/delivery-options/data/delivery/fetchDeliveryOptions';
import { formatDeliveryMoments } from '@/delivery-options/data/delivery/formatDeliveryMoments';
import { formatShipmentOptions } from '@/delivery-options/data/delivery/formatShipmentOptions';
import { getDeliveryDates } from '@/delivery-options/data/delivery/getDeliveryDates';
import { getPackageTypeOptions } from '@/delivery-options/data/delivery/getPackageTypeOptions';

/**
 * If multi carrier, return another level of settings.
 *
 * @param {MyParcel.CarrierName} carrier - Carrier name or id.
 * @param {MyParcel.Platform} platform - Platform name.
 * @returns {Promise.<MyParcelDeliveryOptions.FormEntry[]>}
 */
export async function createDeliveryOptions(
  carrier = configBus.currentCarrier,
  platform = configBus.get(CONFIG.PLATFORM),
) {
  const deliveryOptions = await fetchDeliveryOptions(carrier, platform);

  if (!deliveryOptions.length) {
    return [];
  }

  configBus.dependencies[carrier] = createDeliveryDependencies(deliveryOptions);

  const packageType = configBus.get(CONFIG.PACKAGE_TYPE);
  const isDefaultPackageType = packageType === CONSTS.DEFAULT_PACKAGE_TYPE;

  const packageTypeOrDeliveryMomentOptions = [
    isDefaultPackageType
      ? {
        name: DELIVERY_DATE,
        type: 'select',
        hidden: !configBus.get(CONFIG.FEATURE_ALLOW_SHOW_DELIVERY_DATE),
        choices: getDeliveryDates(deliveryOptions),
      }
      : getPackageTypeOptions(packageType),
  ];

  return [
    ...packageTypeOrDeliveryMomentOptions,
    {
      name: DELIVERY_MOMENT,
      type: 'radio',
      dependency: {
        name: DELIVERY_DATE,
        parent: DELIVERY,
        transform: formatDeliveryMoments,
      },
      choices: [],
    },
    {
      name: SHIPMENT_OPTIONS,
      type: 'checkbox',
      dependency: {
        name: [DELIVERY_DATE, DELIVERY_MOMENT],
        parent: SHIPMENT_OPTIONS,
        transform: formatShipmentOptions,
      },
      choices: [],
    },
  ];
}
