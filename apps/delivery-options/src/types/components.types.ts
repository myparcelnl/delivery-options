import {type MaybeRef} from 'vue';
import {type DeliveryOptionsConfiguration, type DeliveryOptionsOutput} from '@myparcel-do/shared';

export type DeliveryOptionsProps = {
  config?: MaybeRef<DeliveryOptionsConfiguration>;
};

export type DeliveryOptionsEmits = (event: 'update', values: DeliveryOptionsOutput) => void;
