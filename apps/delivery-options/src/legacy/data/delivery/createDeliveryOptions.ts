import {FEATURE_SHOW_DELIVERY_DATE, PACKAGE_TYPE, PLATFORM} from '@myparcel-do/shared';
import {configBus} from '../../config/configBus';
import {transformDeliveryMoments} from './transformDeliveryMoments';
import {getPackageTypeOptions} from './getPackageTypeOptions';
import {getDeliveryDates} from './getDeliveryDates';
import {fetchDeliveryOptions} from './fetchDeliveryOptions';
import {formatShipmentOption} from './dependencies/formatShipmentOption';
import {createDeliveryDependencies} from './dependencies/createDeliveryDependencies';

/**
 * If multi carrier, return another level of settings.
 *
 * @param {MyParcel.CarrierIdentifier} carrier - Carrier name or id.
 * @param {MyParcel.Platform} platform - Platform name.
 * @returns {Promise.<MyParcelDeliveryOptions.FormEntry[]>}
 */
export async function createDeliveryOptions(carrier = configBus.currentCarrier, platform = configBus.get(PLATFORM)) {
  const deliveryOptions = await fetchDeliveryOptions(carrier, platform);

  configBus.dependencies[carrier] = createDeliveryDependencies(deliveryOptions);

  const packageType = configBus.get(PACKAGE_TYPE);
  const isDefaultPackageType = packageType === CONSTS.DEFAULT_PACKAGE_TYPE;

  const packageTypeOrDeliveryDateOptions = [
    isDefaultPackageType
      ? {
          name: DELIVERY_DATE,
          type: 'select',
          hidden: !configBus.get(FEATURE_SHOW_DELIVERY_DATE),
          choices: getDeliveryDates(deliveryOptions),
        }
      : getPackageTypeOptions(packageType),
  ];

  return [
    ...packageTypeOrDeliveryDateOptions,
    {
      name: DELIVERY_MOMENT,
      type: 'radio',
      dependency: {
        name: DELIVERY_DATE,
        parent: DELIVERY,
        transform: transformDeliveryMoments,
      },
      choices: [],
    },
    {
      name: SHIPMENT_OPTIONS,
      type: 'checkbox',
      dependency: {
        name: [DELIVERY_DATE, DELIVERY_MOMENT],
        parent: SHIPMENT_OPTIONS,
        transform: formatShipmentOption,
      },
      choices: [],
    },
  ];
}
