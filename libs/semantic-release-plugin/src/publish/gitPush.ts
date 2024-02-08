import {executeWithErrorHandling, throwIfHasErrors} from '../utils';
import {type ContextWithNextRelease} from '../types';

export const gitPush = async (context: ContextWithNextRelease): Promise<void> => {
  const {env, cwd, logger} = context;

  await executeWithErrorHandling('git', ['push', '--all'], {env, cwd});
  throwIfHasErrors();

  logger.log('Pushed to remote');
};
