import * as FORM from '@/config/formConfig';
import { CARRIER_SETTINGS, FEATURE_SHOW_DELIVERY_DATE } from '@/data/keys/configKeys';
import { DEFAULT_PACKAGE_TYPE } from '@/data/keys/settingsConsts';
import { ExportValues } from '@/delivery-options/config/exports/ExportValues';
import { configBus } from '@/delivery-options/config/configBus';
import { countryCodes } from '@/data/keys/countryCodes';

export class DeliveryExportValues extends ExportValues {
  /**
   * @type {boolean}
   */
  isPickup = false;

  /**
   * @type {string}
   */
  deliveryDate;

  /**
   * @type {MyParcel.PackageType}
   */
  packageType = DEFAULT_PACKAGE_TYPE;

  /**
   * @type {{ShipmentOptionName, boolean}}
   */
  shipmentOptions = [];

  update(values) {
    this.setCarrier(values[FORM.CARRIER]);
    this.setDeliveryType(values[FORM.DELIVERY_MOMENT]);
    this.switchPackageType(values[FORM.PACKAGE_TYPE] || this.packageType);
    this.setShipmentOptions(values);
    this.setDeliveryDate(values);
  }

  /**
   * @param {MyParcel.PackageType} packageType
   */
  switchPackageType(packageType) {
    this.packageType = packageType;

    if (packageType === DEFAULT_PACKAGE_TYPE) {
      return;
    }

    this.deliveryType = null;
    this.deliveryDate = null;
    this.shipmentOptions = [];
  }

  /**
   * There's no delivery type with other package types (yet) so super.isComplete() will return false forever.
   *
   * @returns {boolean | boolean}
   */
  isComplete() {
    if (this.packageType === DEFAULT_PACKAGE_TYPE) {
      return super.isComplete();
    }

    return true;
  }

  /**
   * Determine whether the delivery date should be included.
   *
   * @param {Object} values
   * @returns {null|string}
   */
  shouldShowDeliveryDate(values) {
    const isPackage = DEFAULT_PACKAGE_TYPE === this.packageType;
    const isNlOrBeShipment = [countryCodes.BELGIUM, countryCodes.NETHERLANDS].includes(configBus.address.cc);
    const isPickup = this.deliveryType === FORM.PICKUP_STANDARD;
    const showDeliveryDateFromConfig = configBus.get(FEATURE_SHOW_DELIVERY_DATE, null, this.carrier);

    if (isPackage && isNlOrBeShipment && !isPickup && showDeliveryDateFromConfig) {
      return values[FORM.DELIVERY_DATE] || this.deliveryDate;
    }

    return null;
  }

  setDeliveryDate(values) {
    this.deliveryDate = this.shouldShowDeliveryDate(values);
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
}
