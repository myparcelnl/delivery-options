import {get} from 'radash';
import {useSandboxStore} from '../stores';
import { getAllSandboxConfigOptions } from './getAllSandboxConfigOptions';

// Helper function to check if all parent fields have truthy values
export const allParentsHave = (parents: string[] | undefined, storePrefix?: string): boolean => {
  if (!parents || parents.length === 0) return true;
  const sandboxStore = useSandboxStore();
  const allOptions = getAllSandboxConfigOptions();

  return parents.every((parent) => {
    const fieldName = storePrefix ?  `${storePrefix}.${parent}` : parent;

    // Find the value in the store
    const value = get(sandboxStore, fieldName, false);

    // If the given parent has its own parents, we need to check them as well
    // Recurse all the way up the tree ensuring all parents have truthy values
    // 1. Find out if the parent has its own parents by getting the field definition
    const parentOption = allOptions.find((option) => option.key === parent);
    // 2. Pass those parents to allParentsHave
    // 3. Reuse the storepath, as that would just be the carrier prefix anyway
    return Boolean(value) && allParentsHave(parentOption?.parents, storePrefix);
  });
};
