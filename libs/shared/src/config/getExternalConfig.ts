import {type PlatformName} from '@myparcel/constants';
import {type PropositionConfiguration} from '../types';

/**
 * Mock external configuration service
 * In the future, this will fetch configuration from an external source
 * Currently returns null to simulate external config not being available
 */
export const getExternalConfig = (platform: PlatformName): PropositionConfiguration | null => {
  return null;
};
