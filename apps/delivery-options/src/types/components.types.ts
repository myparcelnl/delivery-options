import {
  type DeliveryOptionsOutput,
  type InputDeliveryOptionsConfiguration,
  type SelectOption,
  type SelectOptionValue,
} from '@myparcel-dev/shared';

export interface DeliveryOptionsProps {
  configuration?: InputDeliveryOptionsConfiguration;
}

export type DeliveryOptionsEmits = (event: 'update', values: DeliveryOptionsOutput) => void;

interface OptionSlotProp<T extends SelectOptionValue> {
  option: SelectOption<T>;
}

export interface GroupInputSlots<T extends SelectOptionValue> {
  content: OptionSlotProp<T>;
  default: OptionSlotProp<T>;
  input: OptionSlotProp<T>;
  right: OptionSlotProp<T>;
}
