import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {type CarrierName, PlatformName} from '@myparcel/constants';
import {
  FEATURES_CUTOFF_TIME,
  FEATURES_DELIVERY,
  FEATURES_DELIVERY_DAYS_WINDOW,
  FEATURES_DROP_OFF_DAYS,
  FEATURES_DROP_OFF_DELAY,
  FEATURES_PICKUP,
  FEATURES_SATURDAY_DELIVERY,
  FEATURES_SHOW_DELIVERY_DATE,
  FEATURES_SIGNATURE,
} from '../../../data/carrierFeatures';
import {AddressField} from '../../../constants';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class BpostCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [BELGIUM, NETHERLANDS];
  }

  public getCountriesForPickup(): string[] {
    return [BELGIUM, NETHERLANDS];
  }

  public getDefaultRequestParameters(): AddressField[] {
    return [AddressField.City, AddressField.PostalCode];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.SendMyParcel]: [
        FEATURES_DELIVERY,
        FEATURES_PICKUP,
        FEATURES_SATURDAY_DELIVERY,
        FEATURES_SIGNATURE,
        FEATURES_SHOW_DELIVERY_DATE,
        FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES_DROP_OFF_DAYS,
        FEATURES_DROP_OFF_DELAY,
        FEATURES_CUTOFF_TIME,
      ],
    };
  }

  public getName(): CarrierName {
    return CarrierName.Bpost;
  }
}
