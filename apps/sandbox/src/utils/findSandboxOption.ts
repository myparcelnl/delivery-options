import {useMemoize} from '@vueuse/core';
import {type ConfigOption} from '@myparcel-dev/shared';
import {getAllSandboxConfigOptions} from '../form';

export const findSandboxOption = useMemoize((option: string): ConfigOption | undefined => {
  const options = getAllSandboxConfigOptions();

  return options.find((item) => item.key === option);
});
