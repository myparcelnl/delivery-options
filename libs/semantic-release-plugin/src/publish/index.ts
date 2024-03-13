import {getPackageJson, hasErrors, throwIfHasErrors} from '../utils';
import {type PublishCmd} from '../types';
import {publishNpmPackage} from './publishNpmPackage';
import {gitPush} from './gitPush';

export const publish: PublishCmd = async (pluginConfig, context) => {
  const pkg = await getPackageJson(context.cwd);
  const {logger} = context;

  await gitPush(context);

  if (pluginConfig.npmPublish === false || pkg.private === true) {
    logger.log('Skipping publish to NPM registry');
    return;
  }

  if (!hasErrors()) {
    for (const additionalPackage of pluginConfig.additionalPackages ?? []) {
      await publishNpmPackage({...context, cwd: additionalPackage});
    }

    await publishNpmPackage(context);
  }

  throwIfHasErrors();
};
