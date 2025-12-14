import {type Translatable, createTranslatable} from '@myparcel-dev/shared';
import {type PackageTypeName} from '@myparcel-dev/constants';

export const createPackageTypeTranslatable = (packageType: PackageTypeName): Translatable => {
  return createTranslatable(`package_type_${packageType}`);
};
