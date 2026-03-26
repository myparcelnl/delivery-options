import {isDefined} from '@vueuse/core';
import {
  CarrierSetting,
  type CarrierSettings,
  type DeliveryOptionsConfig,
  type InputCarrierSettings,
  type InputDeliveryOptionsConfig,
  useLogger,
} from '@myparcel-dev/do-shared';

type ResolvedInputConfig<Input extends InputDeliveryOptionsConfig | InputCarrierSettings> =
  Input extends InputDeliveryOptionsConfig ? DeliveryOptionsConfig : CarrierSettings;

const applyDeprecatedAllowDeliveryOptions = (
  resolvedConfig: DeliveryOptionsConfig | CarrierSettings,
  restConfig: InputDeliveryOptionsConfig | InputCarrierSettings,
  logger: ReturnType<typeof useLogger>,
): void => {
  if (
    isDefined(resolvedConfig[CarrierSetting.AllowDeliveryOptions]) &&
    !isDefined(resolvedConfig[CarrierSetting.AllowStandardDelivery]) &&
    !isDefined(resolvedConfig[CarrierSetting.AllowExpressDelivery])
  ) {
    logger.deprecated(
      `Passing only ${CarrierSetting.AllowDeliveryOptions} without ${CarrierSetting.AllowStandardDelivery}`,
      `${CarrierSetting.AllowDeliveryOptions}: true and ${CarrierSetting.AllowStandardDelivery}: true and/or and ${CarrierSetting.AllowExpressDelivery}: true`,
    );

    resolvedConfig[CarrierSetting.AllowStandardDelivery] = restConfig[CarrierSetting.AllowDeliveryOptions];
  }
};

export const handleDeprecatedOptions = <Input extends InputDeliveryOptionsConfig | InputCarrierSettings>(
  input: Input,
): ResolvedInputConfig<Input> => {
  const logger = useLogger();

  const resolvedConfig = {...input} as unknown as ResolvedInputConfig<Input>;

  applyDeprecatedAllowDeliveryOptions(resolvedConfig, input, logger);

  return resolvedConfig;
};
