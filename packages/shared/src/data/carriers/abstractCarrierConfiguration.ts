import {COUNTRIES, PlatformName} from '@myparcel/sdk';
import {flatten} from 'lodash-unified';
import {hasOwnProperty} from '../../utils/hasOwnProperty';
import {validatePlatform} from '../../validatePlatform';

export type PlatformFeatures = Partial<Record<PlatformName, string[][]>>;

export class AbstractCarrierConfiguration {
  public platform: PlatformName;

  public constructor(platform: PlatformName) {
    this.platform = validatePlatform(platform);
  }

  /**
   * Check if the carrier allows delivery in a specific country.
   */
  public allowsDeliveryIn(country: string): boolean {
    return this.getCountriesForDelivery().includes(country.toUpperCase());
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
    return [
      COUNTRIES.BELGIUM,
      COUNTRIES.NETHERLANDS,
    ];
  }

  /**
   * The countries this carrier can find pickup locations in.
   */
  public getCountriesForPickup(): string[] {
    return [
      COUNTRIES.BELGIUM,
      COUNTRIES.NETHERLANDS,
    ];
  }

  /**
   * Features this carrier has.
   */
  public getFeatures(): PlatformFeatures {
    return {};
  }

  /**
   * Get the features for the current platform.
   */
  public getPlatformFeatures(): string[][] {
    const features = this.getFeatures();

    if (this.platform in features && hasOwnProperty(features, this.platform)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return features[this.platform];
    }

    return [];
  }

  /**
   * Check whether a feature is enabled for this carrier.
   *
   * @param {string | string[]} features
   * @returns {boolean}
   */
  public hasFeature(features: string[]): boolean {
    const platformFeatures = this.getPlatformFeatures();
    const permissions = flatten(platformFeatures);

    if (Array.isArray(features)) {
      return flatten(features).every((feature) => permissions.includes(feature));
    }

    return permissions.includes(features);
  }
}
