import {getPackageJson, execute, addError, throwIfHasErrors} from '../utils';
import {type ContextWithNextRelease} from '../types';

export const updatePackageJsonVersions = async (context: ContextWithNextRelease): Promise<void> => {
  const {cwd, env, logger, nextRelease} = context;
  const pkg = await getPackageJson(context);

  if (pkg?.name) {
    const {version} = nextRelease;

    await execute('yarn', ['workspaces', 'foreach', '-Apv', `exec`, `npm pkg set version=${version}`], {cwd, env});

    logger.log(`Set version in every package.json to ${version}`);
  } else {
    addError(new Error('No package.json found'));
  }

  throwIfHasErrors();
};
