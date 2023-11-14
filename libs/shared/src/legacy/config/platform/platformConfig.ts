import {CONFIG_MAP, platformLocaleMap} from '@myparcel-do/shared';

export const platformConfig = (platform) => CONFIG_MAP[platformLocaleMap[platform]];
