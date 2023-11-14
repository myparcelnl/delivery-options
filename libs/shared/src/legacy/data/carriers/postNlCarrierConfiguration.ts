import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {type CarrierName} from '@myparcel/constants';
import {ADDRESS_CITY, ADDRESS_POSTAL_CODE, ADDRESS_STREET, MYPARCEL, POSTNL, SENDMYPARCEL} from '../keys';
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
import {type AddressField} from '../../../types';
import {AbstractCarrierConfiguration, type PlatformCarrierFeatures} from './abstractCarrierConfiguration';

export class PostNlCarrierConfiguration extends AbstractCarrierConfiguration {
  public getCountriesForDelivery(): string[] {
    return [NETHERLANDS, BELGIUM];
  }

  public getCountriesForPickup(): string[] {
    return [BELGIUM, NETHERLANDS];
  }

  public getDefaultRequestParameters(): AddressField[] {
    return [ADDRESS_POSTAL_CODE, ADDRESS_STREET, ADDRESS_CITY];
  }

  public getFeatures(): PlatformCarrierFeatures {
    return {
      [MYPARCEL]: [
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
      [SENDMYPARCEL]: [
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
    return POSTNL;
  }

  public hasFakeDelivery(): boolean {
    return true;
  }
}
