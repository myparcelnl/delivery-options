import {executeWithErrorHandling} from '../utils';
import {type PrepareCmd} from '../types';
import {updatePackageJsonVersions} from './updatePackageJsonVersions';
import {updatePackageJsonDependencyVersions} from './updatePackageJsonDependencyVersions';
import {setNpmAuth} from './setNpmAuth';
import {gitCommit} from './gitCommit';

export const prepare: PrepareCmd = async (pluginConfig, context) => {
  const {cwd, env} = context;

  await setNpmAuth(context);
  await updatePackageJsonVersions(context);
  await updatePackageJsonDependencyVersions(pluginConfig, context);

  await executeWithErrorHandling('yarn', ['install', '--no-immutable'], {cwd, env});

  await gitCommit(context);
};
