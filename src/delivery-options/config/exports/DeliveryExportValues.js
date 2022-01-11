import * as FORM from '@/config/formConfig';
import { DEFAULT_PACKAGE_TYPE } from '@/data/keys/settingsConsts';
import { ExportValues } from '@/delivery-options/config/exports/ExportValues';

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
    this.deliveryDate = values[FORM.DELIVERY_DATE] || this.deliveryDate;
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
