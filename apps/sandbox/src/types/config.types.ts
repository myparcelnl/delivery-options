import {type InputDeliveryOptionsConfiguration} from '@myparcel-do/shared';

export type SandboxDeliveryOptionsConfiguration = Omit<InputDeliveryOptionsConfiguration, 'components'>;
