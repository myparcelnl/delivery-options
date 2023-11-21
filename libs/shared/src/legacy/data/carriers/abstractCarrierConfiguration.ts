import {flat} from 'radash';
import {type OneOrMore, type ReadonlyOr} from '@myparcel/ts-utils';
import {NETHERLANDS} from '@myparcel/constants/countries';
import {type CarrierName, type PackageTypeName, type PlatformName} from '@myparcel/constants';
import {type SubscriptionId, type SupportedPlatformName} from '../../../types';
import {
  ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ALLOW_PACKAGE_TYPE_MAILBOX,
  PACKAGE_TYPE_DIGITAL_STAMP,
  PACKAGE_TYPE_MAILBOX,
  PACKAGE_TYPE_PACKAGE,
} from '../../../data';
import {AddressField} from '../../../constants';

export type FeatureOption = string;

export type CarrierFeatures = FeatureOption[] | FeatureOption[][];

export type PlatformCarrierFeatures = Partial<Record<PlatformName, CarrierFeatures>>;

export abstract class AbstractCarrierConfiguration {
  protected platform: SupportedPlatformName;

  /**
   * @type {string|null}
   */
  protected subscriptionId: SubscriptionId;

  public constructor(platform: SupportedPlatformName, subscriptionId?: SubscriptionId) {
    this.platform = platform;
    this.subscriptionId = subscriptionId;
  }

  /**
   * Check if the carrier allows delivery in a specific country.
   */
  public allowsDeliveryIn(country: string): boolean {
    return this.getCountriesForDelivery().includes(country.toUpperCase()) || this.hasFakeDelivery();
  }

  /**
   * Check if the carrier offers a specific package type.
   *
   */
  public allowsPackageTypeIn(packageTypeName: PackageTypeName, country: string): boolean {
    switch (packageTypeName) {
      case PACKAGE_TYPE_PACKAGE:
        return true;

      case PACKAGE_TYPE_MAILBOX:
        return country === NETHERLANDS && this.hasFeature(ALLOW_PACKAGE_TYPE_MAILBOX);

      case PACKAGE_TYPE_DIGITAL_STAMP:
        return country === NETHERLANDS && this.hasFeature(ALLOW_PACKAGE_TYPE_DIGITAL_STAMP);

      default:
        return false;
    }
  }

  /**
   * Check if the carrier allows pickup in a specific country.
   */
  public allowsPickupIn(country: string): boolean {
    return this.getCountriesForPickup().includes(country.toUpperCase());
  }

  /**
   * The countries this carrier can deliver to.
   */
  public getCountriesForDelivery(): string[] {
    return [];
  }

  /**
   * The countries this carrier can find pickup locations in.
   *
   */
  public getCountriesForPickup(): string[] {
    return [];
  }

  /**
   * Get the parameters necessary for the delivery options request.
   *
   */
  public getDefaultRequestParameters(): AddressField[] {
    return [AddressField.City, AddressField.PostalCode, AddressField.Street];
  }

  /**
   * Features this carrier has.
   *
   */
  public getFeatures(): PlatformCarrierFeatures {
    return {};
  }

  public abstract getName(): CarrierName;

  /**
   * Get the features for the current platform.
   *
   */
  public getPlatformFeatures(): CarrierFeatures {
    const features = this.getFeatures();

    return features[this.platform] ?? [];
  }

  /**
   * Enable to use empty delivery options (without fetching) for this carrier in all countries that are not in
   * getCountriesForDelivery.
   *
   */
  public hasFakeDelivery(): boolean {
    return false;
  }

  /**
   * Check whether a feature is enabled for this carrier.
   *
   */
  public hasFeature(features: ReadonlyOr<OneOrMore<string>>): boolean {
    const platformFeatures = this.getPlatformFeatures();
    const permissions = flat(platformFeatures);

    if (Array.isArray(features)) {
      return flat(features).every((feature) => permissions.includes(feature));
    }

    return permissions.includes(features);
  }
}
