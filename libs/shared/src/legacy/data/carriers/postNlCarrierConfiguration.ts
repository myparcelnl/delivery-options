import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {
  FEATURES_CUTOFF_TIME,
  FEATURES_DELIVERY,
  FEATURES_DELIVERY_DAYS_WINDOW,
  FEATURES_DROP_OFF_DAYS,
  FEATURES_DROP_OFF_DELAY,
  FEATURES_EVENING_DELIVERY,
  FEATURES_MONDAY_DELIVERY,
  FEATURES_MORNING_DELIVERY,
  FEATURES_ONLY_RECIPIENT,
  FEATURES_PACKAGE_TYPE_DIGITAL_STAMP,
  FEATURES_PACKAGE_TYPE_MAILBOX,
  FEATURES_PICKUP,
  FEATURES_SHOW_DELIVERY_DATE,
  FEATURES_SIGNATURE,
} from '../carrierFeatures';
import {AddressField} from '../../../types';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class PostNlCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [NETHERLANDS, BELGIUM];
  }

  public getCountriesForPickup(): string[] {
    return [BELGIUM, NETHERLANDS];
  }

  public getDefaultRequestParameters(): AddressField[] {
    return [AddressField.PostalCode, AddressField.Street, AddressField.City];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [PlatformName.MyParcel as const]: [
        FEATURES_DELIVERY,
        FEATURES_EVENING_DELIVERY,
        FEATURES_MORNING_DELIVERY,
        FEATURES_ONLY_RECIPIENT,
        FEATURES_PACKAGE_TYPE_DIGITAL_STAMP,
        FEATURES_PACKAGE_TYPE_MAILBOX,
        FEATURES_MONDAY_DELIVERY,
        FEATURES_PICKUP,
        FEATURES_SIGNATURE,
        FEATURES_SHOW_DELIVERY_DATE,
        FEATURES_DELIVERY_DAYS_WINDOW,
        FEATURES_DROP_OFF_DAYS,
        FEATURES_DROP_OFF_DELAY,
        FEATURES_CUTOFF_TIME,
      ],
      [PlatformName.SendMyParcel as const]: [
        FEATURES_DELIVERY,
        FEATURES_ONLY_RECIPIENT,
        FEATURES_PICKUP,
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
    return CarrierName.PostNl as const;
  }

  public hasFakeDelivery(): boolean {
    return true;
  }
}
