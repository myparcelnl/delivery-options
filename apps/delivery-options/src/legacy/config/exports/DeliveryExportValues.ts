import {
  CARRIER,
  DELIVERY_DATE,
  DELIVERY_MOMENT,
  FEATURE_SHOW_DELIVERY_DATE,
  FORM_PACKAGE_TYPE,
  PACKAGE_TYPE_DEFAULT,
  PICKUP_STANDARD,
} from '@myparcel-do/shared';
import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {configBus} from '../configBus';
import {ExportValues} from './ExportValues';

export class DeliveryExportValues extends ExportValues {
  /**
   * @type {null|string}
   */
  deliveryDate;
  /**
   * @type {boolean}
   */
  isPickup = false;
  /**
   * @type {MyParcel.PackageType}
   */
  packageType = PACKAGE_TYPE_DEFAULT;

  /**
   * @type {{ShipmentOptionName, boolean}}
   */
  shipmentOptions = [];

  setDeliveryDate(values) {
    this.deliveryDate = this.shouldShowDeliveryDate(values);
  }

  /**
   * Determine whether the delivery date should be included.
   *
   * @param {Object} values
   * @returns {null|string}
   */
  shouldShowDeliveryDate(values) {
    const isPackage = PACKAGE_TYPE_DEFAULT === this.packageType;
    const isNlOrBeShipment = [BELGIUM, NETHERLANDS].includes(configBus.address.cc);
    const isPickup = this.deliveryType === PICKUP_STANDARD;
    const showDeliveryDateFromConfig = configBus.get(FEATURE_SHOW_DELIVERY_DATE, null, this.carrier);

    if (isPackage && isNlOrBeShipment && !isPickup && showDeliveryDateFromConfig) {
      return values[DELIVERY_DATE] || this.deliveryDate;
    }

    return null;
  }

  /**
   * @param {MyParcel.PackageType} packageType
   */
  switchPackageType(packageType) {
    this.packageType = packageType;

    if (packageType === PACKAGE_TYPE_DEFAULT) {
      return;
    }

    this.deliveryType = null;
    this.deliveryDate = null;
    this.shipmentOptions = [];
  }

  toObject() {
    return {
      isPickup: this.isPickup,
      date: this.deliveryDate,
      carrier: this.carrier,
      packageType: this.packageType,
      deliveryType: this.deliveryType,
      shipmentOptions: this.shipmentOptions,
    };
  }

  update(values) {
    this.setCarrier(values[CARRIER]);
    this.setDeliveryType(values[DELIVERY_MOMENT]);
    this.switchPackageType(values[FORM_PACKAGE_TYPE] || this.packageType);
    this.setShipmentOptions(values);
    this.setDeliveryDate(values);
  }
}
