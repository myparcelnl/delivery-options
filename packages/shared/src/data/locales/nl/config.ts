import * as CONFIG from '../../keys/configKeys';
import {Config} from '../../../delivery-options.types';

export const defaultConfigNl: Partial<Config> = {
  [CONFIG.LOCALE]: 'nl-NL',
  [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
  [CONFIG.SATURDAY_CUTOFF_TIME]: '16:00',
};
