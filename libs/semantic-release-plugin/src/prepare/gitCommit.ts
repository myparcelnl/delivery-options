import {executeWithErrorHandling, throwIfHasErrors} from '../utils';
import {type ContextWithNextRelease} from '../types';

export const gitCommit = async (context: ContextWithNextRelease): Promise<void> => {
  const {env, cwd, nextRelease} = context;

  await executeWithErrorHandling(
    'git',
    ['commit', '-am', `chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}`],
    {
      cwd,
      env,
      stdio: 'inherit',
    },
  );

  throwIfHasErrors();
};
