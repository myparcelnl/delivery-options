import {
  type CarrierSettings,
  type DeliveryOptionsConfig,
  type InputCarrierSettings,
  type InputDeliveryOptionsConfig,
} from '@myparcel-dev/do-shared';

type ResolvedInputConfig<Input extends InputDeliveryOptionsConfig | InputCarrierSettings> =
  Input extends InputDeliveryOptionsConfig ? DeliveryOptionsConfig : CarrierSettings;

export const handleDeprecatedOptions = <Input extends InputDeliveryOptionsConfig | InputCarrierSettings>(
  input: Input,
): ResolvedInputConfig<Input> => {
  return {...input} as unknown as ResolvedInputConfig<Input>;
};
