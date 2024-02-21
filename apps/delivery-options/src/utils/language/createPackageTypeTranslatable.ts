import {type Translatable} from '@myparcel-do/shared';
import {type PackageTypeName} from '@myparcel/constants';
import {createTranslatable} from './createTranslatable';

export const createPackageTypeTranslatable = (packageType: PackageTypeName): Translatable => {
  return createTranslatable(`package_type_${packageType}`);
};
