import {CARRIER, PICKUP_LOCATION, PICKUP_MOMENT, PICKUP_STANDARD} from '@myparcel-do/shared';
import {configBus} from '../configBus';
import {getPickupDate} from '../../data';
import {ExportValues} from './ExportValues';

export class PickupExportValues extends ExportValues {
  /**
   * @type {string}
   */
  deliveryDate;

  /**
   * @type {MyParcelDeliveryOptions.PickupLocation}
   */
  pickupLocation;

  /**
   * Set pickup location and moment, but only after they're both selected.
   *
   * @param {Object} values
   */
  setPickupLocation(values) {
    values[PICKUP_MOMENT] ??= PICKUP_STANDARD;

    const pickupLocationName = values[PICKUP_LOCATION];

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
    const {carrier, possibilities, ...pickupLocation} = foundLocation;

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

  update(values) {
    this.setCarrier(values[CARRIER]);
    this.setDeliveryType(values[PICKUP_MOMENT]);
    this.setPickupLocation(values);
  }
}
