import {getPackageJson, hasErrors, throwIfHasErrors} from '../utils';
import {type PublishCmd} from '../types';
import {removeWorkspaceDependencies} from './removeWorkspaceDependencies';
import {publishNpmPackage} from './publishNpmPackage';
import {gitPush} from './gitPush';

export const publish: PublishCmd = async (pluginConfig, context) => {
  const pkg = await getPackageJson(context);
  const {logger} = context;

  await gitPush(context);

  if (pluginConfig.npmPublish === false || pkg.private === true) {
    logger.log('Skipping publish to NPM registry');
    return;
  }

  await removeWorkspaceDependencies(context);

  if (!hasErrors()) {
    await publishNpmPackage(context);
  }

  throwIfHasErrors();
};
