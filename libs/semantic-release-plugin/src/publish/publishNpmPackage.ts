import {getPackageJson} from '../utils';
import {type ContextWithNextRelease} from '../types';
import {getChannel} from './getChannel';

export const publishNpmPackage = async (context: ContextWithNextRelease): Promise<void> => {
  const {env, cwd, logger, nextRelease} = context;

  const pkg = await getPackageJson(context);

  const tag = getChannel(context.nextRelease.channel);

  // await execute('npm', ['publish', '--tag', tag], {cwd, env, stdio: 'inherit'});

  logger.log(`await execute('npm', ['publish', '--tag', ${tag}], ${JSON.stringify({cwd, env, stdio: 'inherit'})};`);
  logger.log(`Published package ${pkg?.name}@${nextRelease.version} (${tag}) to NPM registry`);
};
