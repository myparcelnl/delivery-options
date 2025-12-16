import {type ConfigOption, useLogger} from '@myparcel-dev/do-shared';

export const filterConfig = <T extends object>(input: object, allOptions: ConfigOption[]): T => {
  const logger = useLogger();

  return Object.entries(input ?? {}).reduce((acc, [key, value]) => {
    const option = allOptions.find((option) => option.key === key);

    if (!option) {
      logger.error(`⚠️ Unknown option: ${key}`);
      return acc;
    }

    const validators = option?.validators ?? [];

    const resolvedValue = validators.reduce((acc, item) => item.preParse?.(acc) ?? acc, value);

    const errors = validators.filter((entry) => !entry.validate(resolvedValue)).map((entry) => entry.error);

    if (errors.length) {
      logger.error(`❌ [${key}]`, errors.join(', '), {value, resolvedValue});
    } else {
      acc[key as keyof T] = validators.reduce((acc, item) => item.parse?.(acc) ?? acc, resolvedValue);
    }

    return acc;
  }, {} as T);
};
