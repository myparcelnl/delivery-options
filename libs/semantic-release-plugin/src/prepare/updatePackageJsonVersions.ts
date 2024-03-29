import {getPackageJson, execute, addError, throwIfHasErrors} from '../utils';
import {type ContextWithNextRelease} from '../types';

export const updatePackageJsonVersions = async (context: ContextWithNextRelease): Promise<void> => {
  const {cwd, env, logger, nextRelease} = context;
  const pkg = await getPackageJson(context.cwd);

  if (pkg?.name) {
    const {version} = nextRelease;

    logger.log(`Setting version in every package.json to ${version}`);
    await execute('yarn', ['workspaces', 'foreach', '-Apv', `exec`, `npm pkg set version=${version}`], {cwd, env});
  } else {
    addError(new Error('No package.json found'));
  }

  throwIfHasErrors();
};
