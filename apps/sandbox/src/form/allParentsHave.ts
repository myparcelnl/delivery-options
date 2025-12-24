import {get} from 'radash';
import {findSandboxOption} from '../utils';
import {useSandboxStore} from '../stores';

export const allParentsHave = (parents: undefined | string[], prefix: string): boolean => {
  if (!parents || parents.length === 0) return true;

  const sandboxStore = useSandboxStore();

  return parents.every((parent) => {
    const optionName = prefix ? `${prefix}.${parent}` : parent;
    const parentOption = findSandboxOption(parent);

    const value = get(sandboxStore.resolvedConfiguration, optionName, false);

    return Boolean(value) && parentOption && allParentsHave(parentOption.parents, prefix);
  });
};
