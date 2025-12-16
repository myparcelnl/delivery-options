import type {DeliveryOptionsAddress, ResolvedDeliveryOptionsConfig} from '@myparcel-do/shared';

/**
 * Build a storage key that is scoped to the current shop/platform + destination address.
 *
 * We intentionally:
 * - Include country and postal code to separate different destinations.
 * - Include packageType because it can affect available options.
 *
 * The actual storage prefix is added in storage.ts; here we only build the logical key.
 */
export const getPersistenceKey = (config: ResolvedDeliveryOptionsConfig, address: DeliveryOptionsAddress): string => {
  const country = (address as DeliveryOptionsAddress & {cc?: string}).cc ?? '';
  const postalCode = (address as DeliveryOptionsAddress & {postalCode?: string}).postalCode ?? '';
  const packageType = (config as ResolvedDeliveryOptionsConfig & {packageType?: string}).packageType ?? '';

  return [country, postalCode, packageType].join(':');
};
