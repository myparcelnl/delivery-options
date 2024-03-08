import {type InputDeliveryOptionsConfiguration} from '../types';

export const defineConfig = <Config extends InputDeliveryOptionsConfiguration>(config: Config): Config => config;
