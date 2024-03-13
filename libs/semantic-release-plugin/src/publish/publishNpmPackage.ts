import {getPackageJson, executeWithErrorHandling} from '../utils';
import {type ContextWithNextRelease} from '../types';
import {getChannel} from './getChannel';

export const publishNpmPackage = async (context: ContextWithNextRelease): Promise<void> => {
  const {env, cwd, logger, nextRelease} = context;

  const pkg = await getPackageJson(context.cwd);
  const tag = getChannel(context.nextRelease.channel);

  logger.log(`Publishing package ${pkg?.name}@${nextRelease.version} (${tag}) to NPM registry`);

  await executeWithErrorHandling('npm', ['publish', '--tag', tag], {cwd, env, stdio: 'inherit'});
};
