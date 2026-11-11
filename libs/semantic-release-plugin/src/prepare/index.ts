import {type PrepareCmd} from '../types';
import {updatePackageJsonVersions} from './updatePackageJsonVersions';
import {gitCommit} from './gitCommit';

export const prepare: PrepareCmd = async (_, context) => {
  await updatePackageJsonVersions(context);
  await gitCommit(context);
};
