import {type PrepareCmd} from '../types';
import {updatePackageJsonVersions} from './updatePackageJsonVersions';
import {setNpmAuth} from './setNpmAuth';
import {gitCommit} from './gitCommit';

export const prepare: PrepareCmd = async (_, context) => {
  await setNpmAuth(context);
  await updatePackageJsonVersions(context);
  await gitCommit(context);
};
