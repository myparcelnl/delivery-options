import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {type CarrierName, PlatformName} from '@myparcel/constants';
import {
  FEATURES_CUTOFF_TIME,
  FEATURES_DELIVERY,
  FEATURES_DELIVERY_DAYS_WINDOW,
  FEATURES_DROP_OFF_DAYS,
  FEATURES_DROP_OFF_DELAY,
  FEATURES_ONLY_RECIPIENT,
  FEATURES_PICKUP,
  FEATURES_SAME_DAY_DELIVERY,
  FEATURES_SIGNATURE,
} from '../../../data/carrierFeatures';
import {AddressField} from '../../../constants';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class DhlForYouCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [NETHERLANDS, BELGIUM];
  }

  public getCountriesForPickup(): string[] {
    return [NETHERLANDS];
  }

  public getDefaultRequestParameters(): AddressField[] {
    return [AddressField.City, AddressField.PostalCode];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.MyParcel]: [
        FEATURES_CUTOFF_TIME,
        FEATURES_DELIVERY,
        FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES_DROP_OFF_DAYS,
        FEATURES_DROP_OFF_DELAY,
        FEATURES_SAME_DAY_DELIVERY,
        // FEATURES_SHOW_DELIVERY_DATE,
        FEATURES_PICKUP,
        FEATURES_ONLY_RECIPIENT,
        FEATURES_SIGNATURE,
      ],
    };
  }

  public getName(): CarrierName {
    return CarrierName.DhlForYou;
  }
}
