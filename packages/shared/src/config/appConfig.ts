import {DEFAULT_PLATFORM} from '../data/keys/settingsConsts';
import {PlatformName} from '@myparcel/sdk';
import {platformDomainMap} from './platform/platformDomainMap';

/**
 * Overrides environment. For use when developing. Set to null to use default behavior.
 *
 * @type {string}
 */
const mode = 'production';

type Environment = 'development' | 'production' | 'staging' | 'test';

interface AppConfig {
  apiUrl: string;
  assetsUrl: string;
}

let appConfig: AppConfig;

export const useAppConfig = (platform: PlatformName = DEFAULT_PLATFORM): AppConfig => {
  if (!appConfig) {
    const domain = platformDomainMap[platform];

    const config: Record<Environment, AppConfig> = {
      production: {
        apiUrl: `https://api.${domain}`,
        assetsUrl: `https://assets.${domain}`,
      },
      staging: {
        apiUrl: `https://api.staging.${domain}`,
        assetsUrl: `https://assets.${domain}`,
      },
      development: {
        assetsUrl: `https://assets.${domain}`,
        apiUrl: `http://api.dev.${domain}`,
      },
      test: {
        apiUrl: `https://api.${domain}`,
        assetsUrl: `https://assets.${domain}`,
      },
    };

    appConfig = config[mode]; // todo: fix mode
  }

  return appConfig;
};
