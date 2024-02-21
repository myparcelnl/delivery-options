import {type Translatable, createTranslatable} from '@myparcel-do/shared';
import {type PackageTypeName} from '@myparcel/constants';

export const createPackageTypeTranslatable = (packageType: PackageTypeName): Translatable => {
  return createTranslatable(`package_type_${packageType}`);
};
