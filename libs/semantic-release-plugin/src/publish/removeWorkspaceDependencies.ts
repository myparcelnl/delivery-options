import {type NormalizedPackageJson} from 'read-pkg';
import {getPackageJson, execute} from '../utils';
import {type ContextWithNextRelease} from '../types';

export const removeWorkspaceDependencies = async (context: ContextWithNextRelease): Promise<NormalizedPackageJson> => {
  const {env, cwd, logger} = context;

  const pkg = await getPackageJson(context);

  const filterWorkspaceVersion = ([, version]: [string, string]) => version.startsWith('workspace:');

  const dependencies = Object.entries(pkg.dependencies ?? {}).filter(filterWorkspaceVersion);
  const devDependencies = Object.entries(pkg.devDependencies ?? {}).filter(filterWorkspaceVersion);

  const itemsToDelete = [
    ...dependencies.map(([name]) => ['dependencies', name]),
    ...devDependencies.map(([name]) => ['devDependencies', name]),
  ];

  const deletions = itemsToDelete.map(([type, name]) => `${type}.${name}`);

  if (deletions.length > 0) {
    logger.log('Removing workspace dependencies from package.json');

    await execute('npm', ['pkg', 'delete', ...deletions], {cwd, env});
  } else {
    logger.log('No workspace dependencies to remove from package.json');
  }

  return pkg;
};
