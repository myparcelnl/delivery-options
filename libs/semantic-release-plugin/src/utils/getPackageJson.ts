import {readPackage, type NormalizedPackageJson} from 'read-pkg';
import {addError, throwIfHasErrors} from './errorHandling';

let pkg: NormalizedPackageJson | undefined;

export const getPackageJson = async (cwd: string): Promise<NormalizedPackageJson> => {
  try {
    if (!pkg) {
      pkg = await readPackage({cwd});
    }

    if (!pkg?.name) {
      addError(new Error('No package.json found'));
    }
  } catch (error) {
    addError(error as Error);
  }

  throwIfHasErrors();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return pkg!;
};
