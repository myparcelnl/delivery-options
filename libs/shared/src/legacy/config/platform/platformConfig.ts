import {CONFIG_MAP} from '../localeConfig';
import {platformLocaleMap} from './platformLocaleMap';

export const platformConfig = (platform) => CONFIG_MAP[platformLocaleMap[platform]];
