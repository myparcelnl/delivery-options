import {getPackageJson, executeWithErrorHandling, throwIfHasErrors} from '../utils';
import {type ContextWithNextRelease} from '../types';
import {getChannel} from './getChannel';

export const publishNpmPackage = async (context: ContextWithNextRelease): Promise<void> => {
  throwIfHasErrors();

  const {env, cwd, logger, nextRelease} = context;

  const pkg = await getPackageJson(context.cwd);
  const tag = getChannel(context.nextRelease.channel);

  logger.log(`Publishing package ${pkg?.name}@${nextRelease.version} (${tag}) to NPM registry`);

  // pnpm only publishes from main by default, and this also releases from the beta and alpha branches.
  await executeWithErrorHandling('pnpm', ['publish', '--tag', tag, '--no-git-checks'], {cwd, env, stdio: 'inherit'});
};
