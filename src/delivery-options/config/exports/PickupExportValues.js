import * as FORM from '@/config/formConfig';
import { ExportValues } from '@/delivery-options/config/exports/ExportValues';
import { PICKUP_STANDARD } from '@/config/formConfig';
import { configBus } from '@/delivery-options/config/configBus';
import { getPickupDate } from '@/delivery-options/data/pickup/getPickupDate';

export class PickupExportValues extends ExportValues {
  /**
   * @type {string}
   */
  deliveryDate;

  /**
   * @type {MyParcelDeliveryOptions.PickupLocation}
   */
  pickupLocation;

  update(values) {
    this.setCarrier(values[FORM.CARRIER]);
    this.setDeliveryType(values[FORM.PICKUP_MOMENT]);
    this.setPickupLocation(values);
  }

  /**
   * Set pickup location and moment, but only after they're both selected.
   *
   * @param {Object} values
   */
  setPickupLocation(values) {
    values[FORM.PICKUP_MOMENT] ??= PICKUP_STANDARD;

    const pickupLocationName = values[FORM.PICKUP_LOCATION];

    if (!pickupLocationName) {
      return;
    }

    const foundLocation = configBus.pickupLocations.find((data) => {
      return data.location_code === pickupLocationName;
    });

    /*
     * After changing address while pickup is selected, the current pickupLocation might not be updated yet. This
     *  causes an error because the old pickup location likely doesn't exist anymore in the pickupLocations array.
     *
     * Return, because the next time pickupLocation will be set this condition will pass.
     */
    if (!foundLocation) {
      return;
    }

    /*
     * Take out the possibilities array to use it to get the deliveryDate, but don't add it to the exportValues.
     * Also remove carrier from the pickupLocation object because it's already set in exportValues.carrier.
     */
    const { carrier, possibilities, ...pickupLocation } = foundLocation;

    this.deliveryDate = getPickupDate(possibilities);
    this.pickupLocation = pickupLocation;
  }

  toObject() {
    return {
      isPickup: true,
      date: this.deliveryDate,
      carrier: this.carrier,
      deliveryType: this.deliveryType,
      pickupLocation: this.pickupLocation,
    };
  }
}
