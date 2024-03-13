import {throwIfHasErrors} from '../utils';
import {type PluginConfig, type ContextWithNextRelease} from '../types';
import {updateWorkspaceDependencies} from './updateWorkspaceDependencies';

export const updatePackageJsonDependencyVersions = async (
  pluginConfig: PluginConfig,
  context: ContextWithNextRelease,
): Promise<void> => {
  await updateWorkspaceDependencies(context);

  for (const additionalPackage of pluginConfig.additionalPackages ?? []) {
    await updateWorkspaceDependencies({...context, cwd: additionalPackage});
  }

  throwIfHasErrors();
};
