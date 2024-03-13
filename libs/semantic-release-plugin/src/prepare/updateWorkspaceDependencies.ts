import {type NormalizedPackageJson} from 'read-pkg';
import {getPackageJson, execute} from '../utils';
import {type ContextWithNextRelease} from '../types';

const filterWorkspaceVersion = ([, version]: [string, string]) => version.startsWith('workspace:');

export const updateWorkspaceDependencies = async (context: ContextWithNextRelease): Promise<NormalizedPackageJson> => {
  const {env, cwd, logger, nextRelease} = context;

  const pkg = await getPackageJson(context.cwd);

  const dependencies = Object.entries(pkg.dependencies ?? {}).filter(filterWorkspaceVersion);
  const devDependencies = Object.entries(pkg.devDependencies ?? {}).filter(filterWorkspaceVersion);

  const itemsToUpdate = [
    ...dependencies.map(([name]) => ['dependencies', name]),
    ...devDependencies.map(([name]) => ['devDependencies', name]),
  ];

  const updates = itemsToUpdate.map(([type, name]) => `${type}.${name}=workspace:^${nextRelease.version}`);

  if (updates.length > 0) {
    logger.log(`Updating workspace dependencies versions in package.json for ${pkg.name}`);

    await execute('npm', ['pkg', 'set', ...updates], {cwd, env});
  } else {
    logger.log(`No workspace dependencies to update in package.json for ${pkg.name}`);
  }

  return pkg;
};
