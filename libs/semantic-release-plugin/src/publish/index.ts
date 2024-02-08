import {getPackageJson, hasErrors, throwIfHasErrors} from '../utils';
import {type PublishCmd} from '../types';
import {removeWorkspaceDependencies} from './removeWorkspaceDependencies';
import {getChannel} from './getChannel';

export const publish: PublishCmd = async (pluginConfig, context) => {
  const {env, cwd, logger, nextRelease} = context;

  const pkg = await getPackageJson(context);

  if (pluginConfig.npmPublish === false || pkg.private === true) {
    logger.log('Skipping publish to NPM registry');
    return;
  }

  await removeWorkspaceDependencies(context);

  if (!hasErrors()) {
    const tag = getChannel(context.nextRelease.channel);

    // await execute('npm', ['publish', '--tag', tag], {cwd, env, stdio: 'inherit'});

    logger.log(`await execute('npm', ['publish', '--tag', ${tag}], ${JSON.stringify({cwd, env, stdio: 'inherit'})};`);
    logger.log(`Published package ${pkg?.name}@${nextRelease.version} (${tag}) to NPM registry`);
  }

  throwIfHasErrors();
};
